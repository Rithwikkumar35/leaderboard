const PISTON_API = 'https://emkc.org/api/v2/piston';

interface ExecutionResult {
  run: {
    stdout: string;
    stderr: string;
    code: number;
    output: string;
  };
}

export interface CodeExecutionResult {
  output: string;
  error: string;
  executionTime: number;
  success: boolean;
}

export async function executeCode(
  language: string,
  code: string
): Promise<CodeExecutionResult> {
  try {
    const response = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: language,
        version: '*',
        files: [
          {
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute code');
    }

    const result: ExecutionResult = await response.json();
    const { stdout, stderr, code: exitCode } = result.run;

    return {
      output: stdout,
      error: stderr,
      executionTime: 0,
      success: exitCode === 0 && !stderr,
    };
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      executionTime: 0,
      success: false,
    };
  }
}

export const DEFAULT_CODE_TEMPLATES: Record<string, string> = {
  javascript: `console.log("Hello, World!");`,
  python: `print("Hello, World!")`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  rust: `fn main() {
    println!("Hello, World!");
}`,
  typescript: `console.log("Hello, World!");`,
};
