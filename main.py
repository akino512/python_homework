from http.server import HTTPServer
from http.server import SimpleHTTPRequestHandler
from datetime import datetime
import webbrowser
import json
import os
import random

store_file_path = "./store_file.txt"
JSON_SEP = (',', ':')

def _date_builder(date_str):
    datetime_format = '%Y-%m-%d'
    return datetime.strptime(date_str, datetime_format)
# 查询
def history_query(body,sjl):
    return (None,[item for item in sjl if
        (_date_builder(item['date']) >= _date_builder(body['date_from'])) and # 判断日期条件From
        (_date_builder(item['date']) <= _date_builder(body['date_to']))   and # 判断日期条件To
        (True if body['type'] == 0 else item['type'] == body['type'])]) # 判断条件类型
# 添加
def history_add(body,sjl):
    ids = [item['id'] for item in sjl]
    body['id'] = 1 if len(ids) == 0 else max(ids)+1 # 设置自增ID
    sjl.append(body)
    return (sjl,'')
# 删除
def history_delete(body,sjl):
    return ([item for item in sjl if body['id'] != item['id']],'')
# 随即生成数据
def history_generate(body,sjl):
    result = []
    def date_builder():
        y = random.randint(2022,2023)
        m = random.randint(1,12)
        d = random.randint(1,31)
        date_str = str(y)+'-'+str(m)+'-'+str(d)
        try:
            _date_builder(date_str)
        except ValueError:
            return date_builder()
        return date_str
    def type_builder():
        return random.choice([1,-1])
    def desc_builder(typ):
        return random.choice(['工资','奖金','理财','其他']) if typ == 1 \
        else random.choice(['交通',"餐饮",'娱乐','其他'])
    def money_builder():
        return random.randint(0,20000)
    for idx in range(0,50):
        obj = {}
        obj['id']    = idx +1
        obj['date']  = date_builder()
        obj['type']  = type_builder()
        obj['desc']  = desc_builder(obj['type'])
        obj['money'] = money_builder()
        result.append(obj)
    return (result,'')

class Chart:
    def __init__(self,lst):
        self._color_c = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2']
        self._color_p = 0
        self.items = []
        self.total = 0
        for item in lst:
            self.add(item)
        for item in self.items:
            self.total += item['money']
        for item in self.items:
            item['share'] = item['money'] / self.total * 100
    def _next_color(self):
        color = self._color_c[self._color_p % len(self._color_c)]
        self._color_p += 1
        return color
    def most(self):
        def templete(desc,share):
            return \
            desc +'收入占比高达'+share+'%，我是理财小达人。'                      if desc == '理财' else \
            desc +'收入占比高达'+share+'%，奖金拿到手软。'                        if desc == '奖金' else \
            desc +'收入占比高达'+share+'%，工资才是王道。'                        if desc == '工资' else \
            desc +'支出占比高达'+share+'%，交通费太高了，不要到处跑了。'          if desc == '交通' else \
            desc +'支出占比高达'+share+'%，饮食支出占比较高，注意不要吃太多哦。'  if desc == '餐饮' else \
            desc +'支出占比高达'+share+'%，放松虽好，也不要过度娱乐哦。'          if desc == '娱乐' else ''
        mst = None
        for item in self.items:
            if(mst == None or item['money'] > mst['money']):
                mst = item
        return '' if mst == None else templete(mst['desc'],"{:.2f}".format(mst['share']))
        
    def find(self,ast):
        result = None
        for item in self.items:
            if ast(item):return item
        return result
    def add(self,new):
        old = self.find(lambda item:new['desc'] == item['desc'])
        if (old != None):
            old['money'] += new['money']
        else:
            self.items.append({
                'desc': new['desc'],
                'money': new['money'],
                'color': self._next_color(),
            })
# 图表分析与总结
def history_conclusion(body,sjl):
    historys = history_query(body,sjl)[1]
    chart1 = Chart([hst for hst in historys if hst['type'] == 1])# 收入
    chart2 = Chart([hst for hst in historys if hst['type'] == -1])# 支出
    result = {
        'chart1':{
            'total': chart1.total,
            'items': chart1.items,
            'most':  chart1.most()
        },
        'chart2':{
            'total': chart2.total,
            'items': chart2.items,
            'most':  chart2.most()
        },
        'balance':chart1.total - chart2.total
    }
    return (None,result)

class Hander(SimpleHTTPRequestHandler):
    def get_storefile_reader(self):
        try:
            return open(store_file_path, 'r+')
        except FileNotFoundError:
            pass
        # 初始化储存文件
        sfw = open(store_file_path, 'w')
        sfw.write('[]')
        sfw.close()
        return open(store_file_path, 'r+')
    def intercepter(self,body,func):
        # 读取文件
        sfr = self.get_storefile_reader()
        # json to python list
        sjl = [_ for _ in json.load(sfr)]
        # 调用分支函数
        rtn = func(body,sjl)
        new_sjl,result = rtn[0],rtn[1]
        # 如果 new_sjl != None 则覆写存储文件
        if(new_sjl != None):
            sfr.seek(0)
            sfr.write(json.dumps(new_sjl, separators=JSON_SEP))
            sfr.truncate()
        # 关闭文件流
        sfr.close()
        # python list to json
        return json.dumps(result, separators=JSON_SEP)
    def do_POST(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        path = self.path
        if (path == '/shutdown') :
            self.server.server_close()
            return
        content_len = int(self.headers.get('Content-Length'))
        body_text = self.rfile.read(content_len).decode()
        body = json.loads(body_text)
        # 功能分支
        func = \
        history_query       if path == '/history_query'       else \
        history_delete      if path == '/history_delete'      else \
        history_add         if path == '/history_add'         else \
        history_conclusion  if path == '/history_conclusion'  else \
        history_generate    if path == '/history_generate'    else None
        # 返回数据
        response_body = \
        ''  if func == None else self.intercepter(body,func)
        self.wfile.write(bytes(response_body, "utf-8"))

def run_server():
    # 注册Hander并创建服务器
    server = HTTPServer(('', 8000), Hander)
    # 启动服务
    try:
        webbrowser.open("http://localhost:8000")
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    server.server_close()

run_server()