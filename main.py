from fastapi import FastAPI, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.encoders import jsonable_encoder
from fastapi_login import LoginManager
import sqlite3  # sqlite3 모듈을 import
from pydantic import BaseModel
from typing import Annotated
import json


class RecordsData(BaseModel):
    name: str
    time: str


class AnswerData(BaseModel):
    id:int
    content: str


class UserData(BaseModel):
    id: str
    password: str
    


con = sqlite3.connect("answers.db", check_same_thread=False)
cur = con.cursor()
cur.execute(
    f"""
                CREATE TABLE IF NOT EXISTS records(
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                time TEXT NOT NULL)
                """
)

app = FastAPI()


@app.get("/answers")  # DB에서 정답 가져오기
async def get_answer():
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


@app.post("/addWords")
async def add_words(data: AnswerData):
    answer = data.content
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    rows = cur.execute(
        f"""
                       INSERT INTO answers(answer)
                       VALUES ('{answer}')
                       """
    )
    con.commit()
    return '200'


@app.post("/signup")
async def signup(user:UserData):
    try:
        cur = con.cursor()
        cur.execute(
            f"""
                CREATE TABLE IF NOT EXISTS users(
                id TEXT PRIMARY KEY,
                password TEXT NOT NULL
                )
            """
        )
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


SECRET = '시크릿키'
manager = LoginManager(SECRET, '/login')

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
async def del_answer(id):
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    cur.execute(f"""
                DELETE FROM answers WHERE id=?
                """,(id))
    con.commit()
    return "200"



# 정적 파일 제공 (frontend 디렉토리)
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
