# import a csv file and convert it to json.

import csv
import json

path = './city500_MERGED_DANDF.csv'
output_path = './city500_MERGED_DANDF.json'

data = []
upper_admin_map = []

with open(path) as f:
    csv_reader = csv.DictReader(f)
    for row in csv_reader:
        upper_admin_map.append(row['upper_admin_name'][0])
        upper_admin_map.append(row['name_chn'][0])
        data.append(row)
        
# print(set(upper_admin_map))

from pypinyin import pinyin, Style

def generate_pinyin_mapping(char_set):
    mapping = {}
    for char in char_set:
        # 获取汉字的拼音
        char_pinyin = pinyin(char, style=Style.NORMAL)
        # 处理多音字，只取第一个拼音
        mapping[char] = char_pinyin[0][0] if char_pinyin else ""
    return mapping

print(generate_pinyin_mapping(set(upper_admin_map)))
# E,C,U,a,o,F
# E => english name
# C => chinese name
# U => upper admin name
# a => latitude
# o => longitude
# F => foreign or domestic