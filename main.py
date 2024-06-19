from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.encoders import jsonable_encoder
import sqlite3  # sqlite3 모듈을 import
from pydantic import BaseModel


class RecordsData(BaseModel):
    name: str
    time: str


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
    cur = con.cursor()
    # DB와 상호작용하기 위한 커서 객체를 생성. 이 객체를 이용하여 DB에서 쿼리를 실행하고 결과를 가져올 수 있음
    cur.execute(
        f"""
            CREATE TABLE IF NOT EXISTS answers(
            id INTEGER PRIMARY KEY,
            answer TEXT NOT NULL
            )
        """
    )
    con.commit()

    con.row_factory = sqlite3.Row
    cur = con.cursor()  # DB에 접근하기 위해 커서 객체 생성
    rows = cur.execute(
        f"""
                        SELECT answer FROM answers
                       """
    ).fetchall()
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
    con = sqlite3.connect("answers.db", check_same_thread=False)
    con.row_factory = sqlite3.Row  # 컬럼명도 같이 가져오는 문법
    cur = con.cursor()
    rows = cur.execute(
        f"""
                SELECT * FROM records ORDER BY time ASC LIMIT 10
                """
    ).fetchall()
    return rows


# 정적 파일 제공 (frontend 디렉토리)
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
