<template>
  <div class="h-screen relative">
    <nav
      class="sticky top-0 text-sm px-3 h-8 flex justify-between items-center bg-black text-white"
    >
      <a href="/"
        ><h2 class="text-md font-medium text-pink-400">
          chatter<span class="text-white font-bold">Box</span>
        </h2></a
      >

      <div class="flex justify-between items-center gap-5">
        <a href="https://js.langchain.com/docs/expression_language/cookbook"
          ><p>LangChain</p></a
        >
        <a href="https://vuejs.org/guide/introduction.html"><p>Vue</p></a>
        <a href="https://tailwindcss.com/"><p>TailwindCSS</p></a>
      </div>
      <button
        class="flex justify-center items-center bg-pink-400 py-1 px-3 rounded-sm text-xs"
      >
        LOGIN
      </button>
    </nav>

    <section
      id="hero"
      class="h-48 bg-center bg-cover bg-no-repeat bg-desktop flex flex-col justify-center text-center"
    >
      <div
        class="flex flex-col justify-center text-center mx-auto bg-black/80 py-4 px-8 rounded-xl text-white"
      >
        <h1 class="text-3xl font-bold mb-1">LangChain</h1>
        <h2 class="text-2xl font-medium text-pink-400">
          chatter<span class="text-white font-bold">Box</span>
        </h2>
      </div>
    </section>

    <section id="chat" class="pt-4 px-4">
      <div
        id="chat-card"
        class="flex flex-col max-w-sm md:max-w-lg mx-auto rounded-md overflow-hidden h-[450px]"
      >
        <div class="flex justify-center items-center bg-black py-3 text-white">
          <p class="text-xs font-semibold">
            LangChain -
            <span class="font-medium text-pink-400">
              chatter<span class="text-white font-bold">Box</span>
            </span>
          </p>
        </div>
        <div
          id="response"
          class="bg-gray-200 p-3 text-white h-44 md:h-64 flex flex-col"
        >
          <div class="border-l-0 border border-solid border-b-gray-400 text-xs text-gray-800 flex justify-left items-center rounded-tl-sm rounded-tr-sm overflow-hidden">
            <p class="bg-gray-300 py-2 px-3">AI Response</p>
          </div>
          <div
            class="p-3 bg-gray-300 h-full rounded-sm text-sm overflow-x-auto overflow-y-auto text-gray-800"
          >
            <template v-if="response">
              <p
                class="inline-flex text-[9px] bg-gray-400 text-gray-200 px-2 rounded-sm"
              >
                Setup
              </p>
              <p class="ml-3 mb-3">{{ response.setup }}</p>
              <p
                class="inline-flex text-[9px] bg-gray-400 text-gray-200 px-2 rounded-sm"
              >
                Punchline
              </p>
              <p class="ml-3">{{ response.punchline }}</p>
            </template>
          </div>
        </div>
        <div id="prompt" class="bg-gray-200 text-sm p-3 flex flex-col">
          <div class="border-l-0 border border-solid border-b-gray-400 text-xs text-gray-800 flex justify-left items-center rounded-tl-sm rounded-tr-sm overflow-hidden">
            <p class="bg-white py-1 px-3">Human Prompt</p>
          </div>
          <textarea
            v-model="input"
            class="text-gray-800 w-full overflow-y-auto p-3 rounded-sm"
            rows="3"
          >
          </textarea>
        </div>
        <div class="flex justify-center items-center">
          <button
            @click="onSendMessage"
            class="bg-pink-400 py-1 px-4 text-sm rounded-sm mt-2"
          >
            Send
          </button>
        </div>
      </div>
    </section>

    <footer
      id="footer"
      class="sticky text-sm px-3 h-8 flex justify-between items-center bg-black text-white w-full bottom-0"
    >
      <h2 class="text-md font-medium text-pink-400">
        chatter<span class="text-white font-bold">Box</span>
      </h2>
      <div class="flex justify-between items-center gap-5">
        <p class="text-xs">
          Copyright 2024 -
          <span class="font-medium text-pink-400">
            chatter<span class="text-white font-bold">Box</span>
          </span>
          Media Inc.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

import { ref } from "vue";

const response = ref("");
const input = ref("pigeons");

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPEN_API_KEY,
  temperature: 0,
});

const prompt = PromptTemplate.fromTemplate(
  "Tell me a joke about \n{format_instructions}\n{input}"
);

const onSendMessage = async () => {
  const functionSchema = [
    {
      name: "joke",
      description: "A joke",
      parameters: {
        type: "object",
        properties: {
          setup: {
            type: "string",
            description: "The setup for the joke",
          },
          punchline: {
            type: "string",
            description: "The punchline for the joke",
          },
        },
        required: ["setup", "punchline"],
      },
    },
  ];

  model.bind({
    functions: functionSchema,
    function_call: { name: "joke" },
  });

  //const stringParser = new StringOutputParser();

  const structuredParser = StructuredOutputParser.fromNamesAndDescriptions({
    setup: "The setup for the joke",
    punchline: "The punchline for the joke",
  });

  const chain = RunnableSequence.from([prompt, model, structuredParser]);

  // const result = await chain.invoke({ input: input.value });

  const result = await chain.invoke({
    input: input.value,
    format_instructions: structuredParser.getFormatInstructions(),
  });

  response.value = result;

  console.log(response.value);
};
</script>
