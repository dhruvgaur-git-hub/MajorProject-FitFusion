from fastapi import FastAPI
from app.routes import router
app=FastAPI(
    title="Fitfusion Chat Support"
)
app.include_router(router)