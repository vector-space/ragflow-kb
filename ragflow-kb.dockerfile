FROM infiniflow/ragflow:nightly-slim
LABEL authors="XiangLiang Zhang"
# COPY ../web/dist /ragflow/web/dist
# COPY ../api /ragflow/api
# COPY ../deepdoc /ragflow/deepdoc
# COPY ../rag /ragflow/rag

COPY web web
COPY api api
COPY conf conf
COPY deepdoc deepdoc
COPY rag rag
COPY agent agent
COPY graphrag graphrag
COPY agentic_reasoning agentic_reasoning
COPY pyproject.toml uv.lock ./

# docker build -f ragflow-kb.dockerfile -t vectorspace/ragflow-kb:v0.0.0 ..