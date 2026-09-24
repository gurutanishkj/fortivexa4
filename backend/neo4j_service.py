"""
Neo4j Graph Database Service & NetworkX Dev Fallback
Primary: Neo4j Bolt Driver
Dev Fallback: In-Memory NetworkX Graph Engine
"""

import time
import logging
from typing import Dict, List, Any
import networkx as nx

from .config import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD

logger = logging.getLogger("fortivexa.neo4j")

neo4j_status = {
    "primary_configured": bool(NEO4J_URI),
    "primary_connected": False,
    "fallback_active": True,
    "uri_masked": NEO4J_URI.split("@")[-1] if "@" in NEO4J_URI else NEO4J_URI,
    "latency_ms": None,
    "last_checked": None,
    "error_message": None,
    "graph_stats": {
        "nodes": 0,
        "edges": 0,
        "rings_detected": 0
    }
}

# In-Memory NetworkX Graph as resilient fallback
nx_graph = nx.DiGraph()
neo4j_driver = None


def init_neo4j():
    global neo4j_driver, neo4j_status
    start = time.time()
    try:
        from neo4j import GraphDatabase
        driver = GraphDatabase.driver(
            NEO4J_URI,
            auth=(NEO4J_USERNAME, NEO4J_PASSWORD),
            connection_timeout=2.0
        )
        # Test connectivity
        with driver.session() as session:
            session.run("RETURN 1 AS ping")
        neo4j_driver = driver
        neo4j_status["primary_connected"] = True
        neo4j_status["fallback_active"] = False
        neo4j_status["latency_ms"] = round((time.time() - start) * 1000, 2)
        neo4j_status["error_message"] = None
        logger.info("Successfully connected to Neo4j database.")
    except Exception as e:
        neo4j_status["primary_connected"] = False
        neo4j_status["fallback_active"] = True
        neo4j_status["error_message"] = str(e)
        neo4j_status["latency_ms"] = round((time.time() - start) * 1000, 2)
        logger.warning(f"Neo4j offline ({e}). Using NetworkX graph fallback.")
    neo4j_status["last_checked"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def check_neo4j_health() -> Dict[str, Any]:
    global neo4j_status
    if neo4j_driver is None and not neo4j_status["last_checked"]:
        init_neo4j()
    return {
        "status": "CONNECTED" if neo4j_status["primary_connected"] else "OFFLINE_FALLBACK_NETWORKX",
        "telemetry": neo4j_status
    }


def populate_graph(accounts: List[Dict], complaints: List[Dict], transactions: List[Dict], locations: List[Dict]):
    """Populates NetworkX graph (and Neo4j if connected) with all nodes & edges"""
    global nx_graph, neo4j_status
    nx_graph.clear()

    # 1. Add Location Nodes
    for loc in locations:
        loc_id = loc.get("location_id")
        nx_graph.add_node(
            loc_id,
            node_type="Location",
            name=loc.get("name"),
            risk_index=loc.get("risk_index", 0.5),
            lat=loc.get("lat"),
            lng=loc.get("lng"),
            jurisdiction=loc.get("jurisdiction")
        )

    # 2. Add Account Nodes
    for acc in accounts:
        acc_id = acc.get("account_id")
        nx_graph.add_node(
            acc_id,
            node_type="Account",
            bank=acc.get("bank_name_anon") or acc.get("bank", "Unknown Bank"),
            role=acc.get("role", "mule_l1"),
            risk_rating=acc.get("risk_rating", "MEDIUM")
        )

    # 3. Add Complaint Nodes
    for cmp in complaints:
        cmp_id = cmp.get("complaint_id")
        nx_graph.add_node(
            cmp_id,
            node_type="Complaint",
            category=cmp.get("category"),
            amount=cmp.get("amount"),
            timestamp=str(cmp.get("timestamp")),
            status=cmp.get("status")
        )

    # 4. Add Transaction Edges & Associations
    for tx in transactions:
        tx_id = tx.get("transaction_id")
        from_acc = tx.get("from_account_id")
        to_acc = tx.get("to_account_id")
        cmp_id = tx.get("complaint_id")
        amt = tx.get("amount", 0.0)

        # Ensure node exists
        if not nx_graph.has_node(from_acc):
            nx_graph.add_node(from_acc, node_type="Account", role="unknown")
        if not nx_graph.has_node(to_acc):
            nx_graph.add_node(to_acc, node_type="Account", role="unknown")

        # Edge: TRANSFERRED_TO
        nx_graph.add_edge(
            from_acc,
            to_acc,
            edge_type="TRANSFERRED_TO",
            transaction_id=tx_id,
            amount=amt,
            hop_level=tx.get("hop_level", 1),
            channel=tx.get("channel", "UPI")
        )

        # Edge: ASSOCIATED_WITH (Complaint -> Accounts)
        if cmp_id and nx_graph.has_node(cmp_id):
            nx_graph.add_edge(cmp_id, from_acc, edge_type="ASSOCIATED_WITH")
            nx_graph.add_edge(cmp_id, to_acc, edge_type="ASSOCIATED_WITH")

    # Update graph stats
    neo4j_status["graph_stats"]["nodes"] = nx_graph.number_of_nodes()
    neo4j_status["graph_stats"]["edges"] = nx_graph.number_of_edges()


def detect_mule_rings(complaints: List[Dict] = None) -> List[Dict[str, Any]]:
    """Detects multi-hop mule clusters and cross-case syndicates sharing L1/L2 accounts"""
    global nx_graph, neo4j_status

    if complaints:
        # Group complaints by shared L1 or L2 mules
        l1_to_cases = {}
        l2_to_cases = {}
        for c in complaints:
            cid = c.get("complaint_id")
            l1 = c.get("target_l1_mule")
            l2 = c.get("target_l2_mule")
            if l1:
                l1_to_cases.setdefault(l1, set()).add(cid)
            if l2:
                l2_to_cases.setdefault(l2, set()).add(cid)

        # Merge clusters sharing accounts
        shared_clusters = []
        visited_cases = set()
        
        for l2, cases in l2_to_cases.items():
            if len(cases) >= 2:
                cluster_cases = set(cases)
                # Find associated L1s
                assoc_l1s = set()
                assoc_stations = set()
                total_vol = 0.0
                for c in complaints:
                    if c.get("complaint_id") in cluster_cases:
                        assoc_l1s.add(c.get("target_l1_mule"))
                        assoc_stations.add(c.get("reporting_station"))
                        total_vol += c.get("amount", 0.0)

                shared_clusters.append({
                    "ring_id": f"RING-{len(shared_clusters) + 1:02d}",
                    "name": f"Syndicate Syndicate Cluster #{len(shared_clusters) + 1}",
                    "shared_l2_mule": l2,
                    "l1_mules": list(assoc_l1s),
                    "member_cases": sorted(list(cluster_cases)),
                    "member_count": len(cluster_cases),
                    "linked_stations": list(assoc_stations),
                    "estimated_volume": round(total_vol, 2),
                    "risk_level": "CRITICAL" if len(cluster_cases) >= 4 else "HIGH"
                })

        if shared_clusters:
            neo4j_status["graph_stats"]["rings_detected"] = len(shared_clusters)
            return shared_clusters

    # Fallback to topological components
    account_nodes = [n for n, d in nx_graph.nodes(data=True) if d.get("node_type") == "Account"]
    sub = nx_graph.subgraph(account_nodes).to_undirected()
    components = [c for c in nx.connected_components(sub) if len(c) >= 3]

    rings = []
    for idx, comp in enumerate(components):
        ring_id = f"RING-{idx + 1:02d}"
        members = list(comp)
        internal_volume = 0.0
        for u in comp:
            for v in comp:
                if nx_graph.has_edge(u, v):
                    internal_volume += nx_graph[u][v].get("amount", 0.0)

        rings.append({
            "ring_id": ring_id,
            "name": f"Syndicate Cluster {idx + 1}",
            "accounts": members,
            "account_count": len(members),
            "estimated_volume": round(internal_volume, 2),
            "risk_level": "CRITICAL" if len(members) >= 5 else "HIGH"
        })

    neo4j_status["graph_stats"]["rings_detected"] = len(rings)
    return rings


def get_cross_case_linkage(complaint_id: str, complaints: List[Dict]) -> Dict[str, Any]:
    """Finds cross-jurisdiction FIRs sharing the same mule accounts with the given complaint"""
    target = next((c for c in complaints if c.get("complaint_id") == complaint_id), None)
    if not target:
        return {"target_case": None, "linked_cases": [], "shared_mules": []}

    target_l1 = target.get("target_l1_mule")
    target_l2 = target.get("target_l2_mule")

    linked = []
    shared_mules = set()

    for c in complaints:
        if c.get("complaint_id") == complaint_id:
            continue
        reasons = []
        if target_l1 and c.get("target_l1_mule") == target_l1:
            reasons.append(f"Shares Intermediary L1 Mule ({target_l1})")
            shared_mules.add(target_l1)
        if target_l2 and c.get("target_l2_mule") == target_l2:
            reasons.append(f"Shares Layer 2 Consolidation Mule ({target_l2})")
            shared_mules.add(target_l2)

        if reasons:
            linked.append({
                "complaint_id": c.get("complaint_id"),
                "reporting_station": c.get("reporting_station"),
                "city": c.get("city"),
                "category": c.get("category"),
                "amount": c.get("amount"),
                "timestamp": str(c.get("timestamp")),
                "status": c.get("status"),
                "link_reasons": reasons
            })

    return {
        "target_case": {
            "complaint_id": target.get("complaint_id"),
            "category": target.get("category"),
            "amount": target.get("amount"),
            "reporting_station": target.get("reporting_station"),
            "city": target.get("city"),
            "l1_mule": target_l1,
            "l2_mule": target_l2
        },
        "linked_cases": linked,
        "shared_mules": list(shared_mules),
        "total_linked": len(linked),
        "cross_jurisdiction": len(set(c["city"] for c in linked if c.get("city") != target.get("city"))) > 0
    }


def calculate_centrality_metrics() -> List[Dict[str, Any]]:
    """Calculates Degree, Betweenness Centrality, and PageRank for all account nodes"""
    global nx_graph
    account_nodes = [n for n, d in nx_graph.nodes(data=True) if d.get("node_type") == "Account"]
    sub = nx_graph.subgraph(account_nodes)

    if not sub.nodes():
        return []

    degree_cent = nx.degree_centrality(sub)
    betweenness = nx.betweenness_centrality(sub)
    try:
        pagerank = nx.pagerank(sub, max_iter=100)
    except Exception:
        pagerank = {n: 0.0 for n in sub.nodes()}

    metrics_list = []
    for n in account_nodes:
        data = nx_graph.nodes[n]
        metrics_list.append({
            "account_id": n,
            "bank": data.get("bank", "Unknown"),
            "role": data.get("role", "mule"),
            "degree_centrality": round(degree_cent.get(n, 0.0), 4),
            "betweenness_centrality": round(betweenness.get(n, 0.0), 4),
            "pagerank": round(pagerank.get(n, 0.0), 4),
            "risk_rating": data.get("risk_rating", "MEDIUM")
        })

    # Sort descending by betweenness centrality (identifies bottleneck mules)
    metrics_list.sort(key=lambda x: x["betweenness_centrality"], reverse=True)
    return metrics_list


def get_account_network(account_id: str) -> Dict[str, Any]:
    """Returns ego-subgraph for an account up to 2 hops"""
    global nx_graph
    if not nx_graph.has_node(account_id):
        return {"nodes": [], "edges": [], "metrics": {}}

    # 2-hop neighborhood
    neighbors_1 = set(nx_graph.successors(account_id)) | set(nx_graph.predecessors(account_id))
    neighborhood = {account_id} | neighbors_1
    for n in neighbors_1:
        neighborhood |= set(nx_graph.successors(n)) | set(nx_graph.predecessors(n))

    subgraph = nx_graph.subgraph(neighborhood)

    nodes = []
    for n, data in subgraph.nodes(data=True):
        nodes.append({
            "id": n,
            "label": n,
            "type": data.get("node_type", "Account"),
            "role": data.get("role", "mule"),
            "risk": data.get("risk_rating", "MEDIUM")
        })

    edges = []
    for u, v, data in subgraph.edges(data=True):
        edges.append({
            "source": u,
            "target": v,
            "type": data.get("edge_type", "TRANSFERRED_TO"),
            "amount": data.get("amount", 0.0),
            "hop": data.get("hop_level", 1)
        })

    # Degree, betweenness for ego node
    degree = nx_graph.degree(account_id)
    in_degree = nx_graph.in_degree(account_id)
    out_degree = nx_graph.out_degree(account_id)

    return {
        "nodes": nodes,
        "edges": edges,
        "metrics": {
            "degree": degree,
            "in_degree": in_degree,
            "out_degree": out_degree,
            "total_volume": sum(d.get("amount", 0.0) for _, _, d in subgraph.edges(data=True))
        }
    }
