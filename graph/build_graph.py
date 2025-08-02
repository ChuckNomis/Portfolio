"""
Graph RAG Builder for NadavBot Portfolio
Uses LlamaIndex and LangGraph to build a knowledge graph from personal data.
"""

import json
import yaml
import os
from pathlib import Path
from typing import Dict, List, Any

from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    KnowledgeGraphIndex,
    ServiceContext
)
from llama_index.core.node_parser import SimpleNodeParser
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.core.storage.index_store import SimpleIndexStore
from llama_index.core.vector_stores import SimpleVectorStore
from llama_index.core.graph_stores import SimpleGraphStore

# For OpenAI integration
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding


class NadavBotKnowledgeGraph:
    """
    Builds and manages the knowledge graph for NadavBot using LlamaIndex.
    """

    def __init__(self, data_dir: str = "data", storage_dir: str = "storage"):
        self.data_dir = Path(data_dir)
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)

        # Initialize LLM and embedding model
        self.llm = OpenAI(model="gpt-3.5-turbo", temperature=0.1)
        self.embed_model = OpenAIEmbedding(model="text-embedding-ada-002")

        # Initialize storage components
        self.storage_context = self._init_storage_context()
        self.service_context = ServiceContext.from_defaults(
            llm=self.llm,
            embed_model=self.embed_model
        )

        self.kg_index = None
        self.vector_index = None

    def _init_storage_context(self) -> StorageContext:
        """Initialize storage context for persistent storage."""
        return StorageContext.from_defaults(
            docstore=SimpleDocumentStore(),
            vector_store=SimpleVectorStore(),
            index_store=SimpleIndexStore(),
            graph_store=SimpleGraphStore()
        )

    def load_structured_data(self) -> Dict[str, Any]:
        """Load structured data from YAML and JSON files."""
        structured_data = {}

        # Load projects data
        projects_file = self.data_dir / "projects.yaml"
        if projects_file.exists():
            with open(projects_file, 'r', encoding='utf-8') as f:
                structured_data['projects'] = yaml.safe_load(f)

        # Load timeline data
        timeline_file = self.data_dir / "timeline.json"
        if timeline_file.exists():
            with open(timeline_file, 'r', encoding='utf-8') as f:
                structured_data['timeline'] = json.load(f)

        return structured_data

    def build_knowledge_graph(self):
        """Build the complete knowledge graph from all data sources."""
        print("Building NadavBot Knowledge Graph...")

        # Load documents from markdown and text files
        documents = SimpleDirectoryReader(
            input_dir=str(self.data_dir),
            required_exts=[".md", ".txt"]
        ).load_data()

        # Load structured data
        structured_data = self.load_structured_data()

        # Enhance documents with structured data context
        enhanced_docs = self._enhance_documents_with_structured_data(
            documents, structured_data
        )

        # Build Knowledge Graph Index
        print("Creating Knowledge Graph Index...")
        self.kg_index = KnowledgeGraphIndex.from_documents(
            enhanced_docs,
            storage_context=self.storage_context,
            service_context=self.service_context,
            max_triplets_per_chunk=3,
            show_progress=True
        )

        # Build Vector Index for semantic search
        print("Creating Vector Index...")
        self.vector_index = VectorStoreIndex.from_documents(
            enhanced_docs,
            storage_context=self.storage_context,
            service_context=self.service_context,
            show_progress=True
        )

        # Persist the indices
        self._persist_indices()

        print("Knowledge Graph built successfully!")
        return self.kg_index, self.vector_index

    def _enhance_documents_with_structured_data(
        self, documents: List, structured_data: Dict[str, Any]
    ) -> List:
        """Enhance documents with structured data for better graph construction."""
        enhanced_docs = documents.copy()

        # Add project information as structured text
        if 'projects' in structured_data:
            for project in structured_data['projects']['projects']:
                project_text = self._format_project_text(project)
                # Create a document-like object for the project
                enhanced_docs.append(type(documents[0])(
                    text=project_text,
                    metadata={
                        'source': 'projects',
                        'project_name': project['name'],
                        'category': project['category'],
                        'year': project['year']
                    }
                ))

        # Add timeline information
        if 'timeline' in structured_data:
            for event in structured_data['timeline']['timeline']:
                event_text = self._format_timeline_event(event)
                enhanced_docs.append(type(documents[0])(
                    text=event_text,
                    metadata={
                        'source': 'timeline',
                        'year': event['year'],
                        'type': event['type'],
                        'category': event['category']
                    }
                ))

        return enhanced_docs

    def _format_project_text(self, project: Dict) -> str:
        """Format project data as natural text for graph construction."""
        text = f"Project: {project['name']}\n"
        text += f"Description: {project['description']}\n"
        text += f"Technologies: {', '.join(project['technologies'])}\n"
        text += f"Year: {project['year']}\n"
        text += f"Status: {project['status']}\n"
        text += f"Category: {project['category']}\n"

        if 'highlights' in project:
            text += f"Key highlights: {'. '.join(project['highlights'])}\n"

        if 'metrics' in project:
            metrics_text = ', '.join(
                [f"{k}: {v}" for k, v in project['metrics'].items()])
            text += f"Metrics: {metrics_text}\n"

        return text

    def _format_timeline_event(self, event: Dict) -> str:
        """Format timeline event as natural text."""
        text = f"Timeline Event ({event['year']}-{event.get('month', 'Unknown')}): {event['title']}\n"
        text += f"Description: {event['description']}\n"
        text += f"Type: {event['type']}\n"
        text += f"Category: {event['category']}\n"

        if 'technologies' in event:
            text += f"Technologies involved: {', '.join(event['technologies'])}\n"

        return text

    def _persist_indices(self):
        """Persist indices to storage."""
        kg_storage_dir = self.storage_dir / "kg_index"
        vector_storage_dir = self.storage_dir / "vector_index"

        kg_storage_dir.mkdir(exist_ok=True)
        vector_storage_dir.mkdir(exist_ok=True)

        # Save indices
        self.kg_index.storage_context.persist(persist_dir=str(kg_storage_dir))
        self.vector_index.storage_context.persist(
            persist_dir=str(vector_storage_dir))

        print(f"Indices saved to {self.storage_dir}")

    def load_existing_indices(self):
        """Load existing indices from storage."""
        kg_storage_dir = self.storage_dir / "kg_index"
        vector_storage_dir = self.storage_dir / "vector_index"

        if kg_storage_dir.exists() and vector_storage_dir.exists():
            print("Loading existing indices...")

            # Load Knowledge Graph Index
            kg_storage_context = StorageContext.from_defaults(
                persist_dir=str(kg_storage_dir)
            )
            self.kg_index = KnowledgeGraphIndex.load_from_storage(
                storage_context=kg_storage_context,
                service_context=self.service_context
            )

            # Load Vector Index
            vector_storage_context = StorageContext.from_defaults(
                persist_dir=str(vector_storage_dir)
            )
            self.vector_index = VectorStoreIndex.load_from_storage(
                storage_context=vector_storage_context,
                service_context=self.service_context
            )

            print("Indices loaded successfully!")
            return True
        else:
            print("No existing indices found. Will build new ones.")
            return False

    def query_graph(self, query: str, mode: str = "hybrid") -> str:
        """Query the knowledge graph."""
        if not self.kg_index or not self.vector_index:
            raise ValueError(
                "Indices not built or loaded. Call build_knowledge_graph() first.")

        if mode == "graph":
            query_engine = self.kg_index.as_query_engine()
        elif mode == "vector":
            query_engine = self.vector_index.as_query_engine()
        else:  # hybrid
            # Create a hybrid query engine (implementation would depend on specific needs)
            query_engine = self.kg_index.as_query_engine()

        response = query_engine.query(query)
        return str(response)


def main():
    """Main function to build the knowledge graph."""
    # Load environment variables
    import os
    from dotenv import load_dotenv
    load_dotenv()

    if not os.getenv("OPENAI_API_KEY"):
        print("Warning: OPENAI_API_KEY not found in environment variables.")
        print("Please set your OpenAI API key in .env file")
        return

    # Initialize and build knowledge graph
    kg_builder = NadavBotKnowledgeGraph()

    # Try to load existing indices, otherwise build new ones
    if not kg_builder.load_existing_indices():
        kg_builder.build_knowledge_graph()

    # Test the graph with some sample queries
    test_queries = [
        "What are Nadav's main technical skills?",
        "Tell me about Nadav's AI projects",
        "What technologies does Nadav use for frontend development?",
        "When did Nadav start working with AI?"
    ]

    print("\n" + "="*50)
    print("Testing Knowledge Graph with sample queries:")
    print("="*50)

    for query in test_queries:
        print(f"\nQuery: {query}")
        try:
            response = kg_builder.query_graph(query)
            print(f"Response: {response}")
        except Exception as e:
            print(f"Error: {e}")
        print("-" * 30)


if __name__ == "__main__":
    main()
