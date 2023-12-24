import json
import typing
from copy import deepcopy


def list_to_tree(list_data: typing.List[dict], node_key: typing.Any = None):
    res = {}
    for v in list_data:
        res.setdefault(v["id"], v).update(v)
        res.setdefault(v["parent_id"], {}).setdefault(
            "children", []).append(res.get(v["id"], v))
    return [res[node_key]]


def parse_step_key(data_list, key=json.dumps([]), ancestor=json.dumps([])):
    for index in range(len(data_list)):
        data = data_list[index]
        data["ancestor"] = [*json.loads(ancestor), data["parent_id"]]
        data["path"] = [*json.loads(key), index]
        data["key"] = "-".join([str(i) for i in data["path"]])
        if data.get("children", False):
            parse_step_key(data_list[index]["children"],
                           json.dumps(data["path"]), json.dumps(data["ancestor"]))
    return data_list
