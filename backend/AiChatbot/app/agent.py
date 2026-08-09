from langchain.agents import create_agent
from app.tools.catalogue_tools import search_products, get_product_details, check_stock_and_price
from app.tools.knowledge_tools import retrieve_fitness_knowledge
from app.prompts import FITFUSION_SYSTEM_PROMPT
from app.config import LLM_MODEL

AGENT_TOOLS = [
    search_products,
    get_product_details,
    check_stock_and_price,
    retrieve_fitness_knowledge,
]

agent = create_agent(LLM_MODEL, AGENT_TOOLS, system_prompt=FITFUSION_SYSTEM_PROMPT)