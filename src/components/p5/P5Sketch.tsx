/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useEffect, useRef, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";

function P5SketchComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [jsonString, setJSONString] = useState<string>("");
  const { client, setConfig } = useLiveAPIContext();

  useEffect(() => {
    const w = window as any;
    if (containerRef.current && w.initSketch) {
      w.initSketch(containerRef.current);
    }
  }, [containerRef]);

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "text",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: 'You and I are working on some minimal art together. We have 3 circles on a canvas. I want your help moving those circles around. Every time that I ask you something, I want you to use the "get_circles" function to understand where the circles are. Once you receive the response for "get_circles" I want you to use either the "change_circle" to modify one circle or the "set_circles" to change them to accomplish our mutual goals. Every time I ask you ask you to do something you should call "get_circles" then "change_circle" after evaluating the response.',
          },
        ],
      },
      tools: [
        // there is a free-tier quota for search
        { googleSearch: {} },
        {
          functionDeclarations: [
            {
              name: "get_circles",
              description: "Get a list of circles in my application",
            },
            // {
            //   name: "set_circles",
            //   description: "Set the list of circles in my application",
            //   parameters: {
            //     type: SchemaType.OBJECT,
            //     properties: {
            //       circles: {
            //         type: SchemaType.ARRAY,
            //         items: {
            //           type: SchemaType.OBJECT,
            //           properties: {
            //             color: {
            //               type: SchemaType.STRING,
            //               description: "the color of the circle",
            //             },
            //             x: {
            //               type: SchemaType.NUMBER,
            //               description:
            //                 "the horizontal axis position of the circle",
            //             },
            //             y: {
            //               type: SchemaType.NUMBER,
            //               description:
            //                 "the vertical axis position of the circle. Lower 'y' values are higher.",
            //             },
            //             radius: {
            //               type: SchemaType.NUMBER,
            //               description: "the radius of the circle",
            //             },
            //           },
            //           required: ["color", "x", "y", "radius"],
            //         },
            //       },
            //     },
            //     required: ["circles"],
            //   },
            // },
            {
              name: "change_circle",
              description: "Change one of the circles",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  color: {
                    type: SchemaType.STRING,
                  },
                  x: {
                    type: SchemaType.NUMBER,
                  },
                  y: {
                    type: SchemaType.NUMBER,
                  },
                  radius: {
                    type: SchemaType.NUMBER,
                  },
                },
                required: ["color", "x", "y", "radius"],
              },
            },
          ],
        },
      ],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      console.log(`got toolcall`, toolCall);
      toolCall.functionCalls.forEach((fc) => {
        const w = window as any;
        const func: Function = w[fc.name];
        if (fc.name === "get_circles") {
          setTimeout(
            () =>
              client.sendToolResponse({
                functionResponses: [
                  {
                    response: w.get_circles(),
                    id: fc.id,
                  },
                ],
              }),
            500,
          );
        } else if (func && typeof func === "function") {
          func(fc.args);
          client.sendToolResponse({
            functionResponses: [
              {
                response: {
                  content: { ...w.get_circles() },
                },
                id: fc.id,
              },
            ],
          });
        } else {
          console.error(`Unhandled function call for ${fc.name}`);
        }
      });
    };
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedRef.current && jsonString) {
      vegaEmbed(embedRef.current, JSON.parse(jsonString));
    }
  }, [embedRef, jsonString]);
  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    />
  );
}

export const P5Sketch = memo(P5SketchComponent);
