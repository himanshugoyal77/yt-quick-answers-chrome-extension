import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import { PineconeStore } from "langchain/vectorstores/pinecone";
import pineconeClient from "./connect.js";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { RunnableSequence } from "@langchain/core/runnables";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HuggingFaceInference } from "langchain/llms/hf";
import greetings from "./greetings.js";


const app = express();
const PORT = process.env.PORT || 4300;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const embeddings2 = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.Hf_API_KEY, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
});

const generateVectors = async (desc, namespace) => {
  try {
    await pineconeClient.getConfig();

    // if (!(await pineconeClient.indexExists("quill"))) {
    //   await pineconeClient.createIndex("quill");
    // }

    console.log("pineconeClient", pineconeClient);
    //const index = pc.index('products');
    const pineconeIndex = pineconeClient.index("quill");

    // check if namespace exists
    const namespaces = await (
      await pineconeIndex.describeIndexStats()
    ).namespaces;
    console.log("namespaces", namespaces);

    if (namespace.length > 0 && namespaces[namespace]) {
      console.log("Namespace exists");
      return;
    }

    console.log("desc", desc);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });

    const docs = await textSplitter.splitText(desc);
    console.log("docs", docs);

    await PineconeStore.fromTexts(docs, {}, embeddings2, {
      pineconeIndex,
      namespace: namespace,
    });

    console.log("Index created");
  } catch (e) {
    console.log(e);
  }
};

app.post("/generate-vectors", async (req, res) => {
  const { transcript, videoId } = req.body;
  console.log("transcript", transcript);

  try {
    await generateVectors(transcript, videoId);
    res.status(200).send({
      message: "Vectors generated successfully",
    });
  } catch (error) {
    return res.status(200).send({
      message: "Internal server error",
    });
  }
});

const handleQuery = async (namespace, query) => {
  console.log("namespace", namespace);
  try {
    await pineconeClient.getConfig();
    const pineconeIndex = pineconeClient.index("quill");

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings2, {
      pineconeIndex,
      namespace: namespace,
    });

    const retriever = vectorStore.asRetriever();

    const formatChatHistory = (human, ai, previousChatHistory) => {
      const newInteraction = `Human: ${human}\nAI: ${ai}`;
      if (!previousChatHistory) {
        return newInteraction;
      }
      return `${previousChatHistory}\n\n${newInteraction}`;
    };

    const questionPrompt = PromptTemplate.fromTemplate(
      `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
      ----------------
      CONTEXT: {context}
      ----------------
      CHAT HISTORY: {chatHistory}
      ----------------
      QUESTION: {question}
      ----------------
      Helpful Answer:`
    );

    const model = new HuggingFaceInference({
      apiKey: process.env.Hf_API_KEY,
      model: "mistralai/Mistral-7B-Instruct-v0.2",
    });

    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chatHistory: (input) => input.chatHistory ?? "",
        context: async (input) => {
          const relevantDocs = await retriever.invoke(input.question);
          const serialized = formatDocumentsAsString(relevantDocs);
          return serialized;
        },
      },
      questionPrompt,
      model,
      new StringOutputParser(),
    ]);

    const results = await vectorStore.similaritySearch(query, 2);
    if (results.length === 0) {
      return "No results found";
    }
    const resultOne = await chain.invoke({
      question: query,
    });
    console.log("resultOne", resultOne);
    return resultOne;
    // setResponse(JSON.stringify(results, null, 2));
  } catch (e) {
    console.log(e);
  }
};

app.post("/search", async (req, res) => {
  const { query, videoId } = req.body;
  console.log("query", query);
  if (
    query.toLowerCase() === "hi" ||
    query.toLowerCase() === "hello" ||
    query.toLowerCase() === "hey" ||
    query.toLowerCase() === "hi there" ||
    query.toLowerCase() === "hello there"
  ) {
    return res.status(200).send({
      message: "Hi, How can I help you?",
    });
  }
  try {
    const msg = await handleQuery(videoId, query);
    if (msg === "No results found") {
      return res.status(200).send({
        message: msg,
      });
    }
    res.status(200).send({
      message: msg,
    });
  } catch (e) {
    console.log(e);
    res.status(200).send({
      message: "Internal server error",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
