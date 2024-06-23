from fastapi import FastAPI, HTTPException, Form,Depends
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.encoders import jsonable_encoder
from fastapi_login import LoginManager
import sqlite3  # sqlite3 모듈을 import
from pydantic import BaseModel
from typing import Annotated
import json


class RecordsData(BaseModel): #기록관리를 위한 basemodel
    name: str
    time: str


class AnswerData(BaseModel): #정답 관리를 위한 모델
    id:int
    content: str
    
class AddData(BaseModel): #maker에서 단어 추가할때 필요한 모델
    content :str


class UserData(BaseModel): #회원가입할때 유저정보 저장할 모델
    id: str
    password: str
    

SECRET = '시크릿키'
manager = LoginManager(SECRET, '/login') #로그인 매니저 생성

@manager.user_loader() #유저로더 정의 및 
def query_user(data):
    WHERE_STATEMENTS = f'id="{data}"'
    if type(data) == dict:
        WHERE_STATEMENTS = f'id="{data['id']}"'
    con.row_factory = sqlite3.Row  # 컬럼명도 같이 가져옴
    cur = con.cursor()
    user = cur.execute(f"""
                       SELECT * FROM users WHERE {WHERE_STATEMENTS}
                       """).fetchone()
    return user


con = sqlite3.connect("word_search.db", check_same_thread=False)
cur = con.cursor()
cur.execute(
    f"""
                CREATE TABLE IF NOT EXISTS records(
                id TEXT PRIMARY KEY,
                time TEXT NOT NULL)
                """
)
cur.execute(
    f"""
                CREATE TABLE IF NOT EXISTS answers(
                id INTEGER PRIMARY KEY,
                answer TEXT UNIQUE NOT NULL)
                """
)
cur.execute(
            f"""
                CREATE TABLE IF NOT EXISTS users(
                id TEXT PRIMARY KEY,
                password TEXT NOT NULL
                )
            """
        )
con.commit()

app = FastAPI()


@app.get("/answers")  # DB에서 정답 가져오기
async def get_answer(user=Depends(manager)):
    con.row_factory = sqlite3.Row
    cur = con.cursor()  # DB에 접근하기 위해 커서 객체 생성
    rows = cur.execute(
        f"""
                        SELECT answer FROM answers ORDER BY RANDOM() LIMIT 5
                       """
    ).fetchall()
    return JSONResponse(jsonable_encoder(dict(row) for row in rows))

@app.get('/Allanswers')
async def get_all_answer():
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    rows = cur.execute(f"""
                SELECT id, answer FROM answers
                """).fetchall()
    return JSONResponse(jsonable_encoder(dict(row) for row in rows))


@app.post("/gameOver")
async def post_record(data: RecordsData):
    name = data.name
    time = data.time

    cur = con.cursor()
    cur.execute(
        f"""
                INSERT INTO records(name, time) VALUES('{name}','{time}')
                """
    )
    con.commit()

    return "200"


@app.get("/records")
async def get_records():
    con.row_factory = sqlite3.Row  # 컬럼명도 같이 가져오는 문법
    cur = con.cursor()
    rows = cur.execute(
        f"""
                SELECT * FROM records ORDER BY time ASC LIMIT 10
                """
    ).fetchall()
    return rows

@app.get("/Allrecords")
async def get_records():
    con.row_factory = sqlite3.Row  # 컬럼명도 같이 가져오는 문법
    cur = con.cursor()
    rows = cur.execute(
        f"""
                SELECT * FROM records ORDER BY time ASC
                """
    ).fetchall()
    return rows

@app.post("/addWords")
async def add_words(data:AddData):
    answer = data.content
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    cur.execute(
        f"""
                       INSERT OR IGNORE INTO answers(answer)
                       VALUES (?)
                       """,(answer.upper(),)
    )
    con.commit()
    return '200'


@app.post("/signup")
async def signup(user:UserData):
    try:
        cur = con.cursor()
        cur.execute(
            f"""
                    INSERT INTO users(id, password)
                    VALUES (?,?)
                    """,(user.id, user.password)
        )
        con.commit()
        return "200"
    except sqlite3.IntegrityError as e:
        return 'duplicate id'
    


@app.post("/login")
async def login(user: UserData):
    id = user.id
    password = user.password
    user = query_user(id)
    if not user:
        return 'not user'
    elif password != user['password']:
        return 'invalid password'
    else:
        accessToken = manager.create_access_token(data={
            'sub':{
                'id':user['id'],
            }
        })
        return accessToken
    
    
@app.put('/answers/{id}')
async def put_answer(data : AnswerData):
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    cur.execute(f"""
                UPDATE answers SET answer=? WHERE id=?
                """,(data.content.upper(), data.id))
    con.commit()
    return "200"

@app.delete('/answers/{id}')
async def del_answer(id: int):
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    cur.execute("DELETE FROM answers WHERE id=?", (id,))
    con.commit()
    return {"status": "200"}



# 정적 파일 제공 (frontend 디렉토리)
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
