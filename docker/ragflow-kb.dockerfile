FROM infiniflow/ragflow:v0.17.2-slim
LABEL authors="XiangLiang Zhang"
COPY ../web/dist /ragflow/web/dist
COPY ../api /ragflow/api
COPY ../deepdoc /ragflow/deepdoc
COPY ../rag /ragflow/rag

# docker build -f ragflow-kb.dockerfile -t vectorspace/ragflow-kb:v0.0.0 ..