import json
data_list = [
    {
        "id": "7a756ca8-83ca-47aa-96f0-385bc82ba7af",
        "type": "OT01",
        "name": "本社01",
        "parent_id": None,
        "children": [
            {
                "id": "4754b2d5-add2-4b47-9891-dfde3c992635",
                "type": "OT02",
                "name": "東京エリア",
                "parent_id": "7a756ca8-83ca-47aa-96f0-385bc82ba7af",
                "children": [
                    {
                        "id": "ecefbd09-a4e7-4b0a-9885-759e8b164397",
                        "type": "OT03",
                        "name": "東京支店01",
                        "parent_id": "4754b2d5-add2-4b47-9891-dfde3c992635"
                    },
                    {
                        "id": "7c56b92c-2210-4243-b5ce-a0347fe3cb64",
                        "type": "OT03",
                        "name": "東京支店02",
                        "parent_id": "4754b2d5-add2-4b47-9891-dfde3c992635"
                    }
                ]
            },
            {
                "id": "2066b1f1-d6c3-4520-ac06-c01dacc76f03",
                "type": "OT02",
                "name": "神奈川エリア",
                "parent_id": "7a756ca8-83ca-47aa-96f0-385bc82ba7af",
                "children": [
                    {
                        "id": "90619bdf-61e4-4248-91f9-715c948bdab8",
                        "type": "OT03",
                        "name": "神奈川支店01",
                        "parent_id": "2066b1f1-d6c3-4520-ac06-c01dacc76f03"
                    },
                    {
                        "id": "77607553-35da-4c13-973f-dd9088a68759",
                        "type": "OT03",
                        "name": "神奈川支店02",
                        "parent_id": "2066b1f1-d6c3-4520-ac06-c01dacc76f03"
                    }
                ]
            }
        ]
    }
]


def parse_main(data_list, key=json.dumps([])):
    for index in range(len(data_list)):
        data = data_list[index]
        data["path"] = [*json.loads(key), index]
        data["key"] = "-".join([str(i) for i in data["path"]])
        if data.get("children", False):
            parse_main(data_list[index]["children"], json.dumps(data["path"]))


parse_main(data_list)

print(json.dumps(data_list))
