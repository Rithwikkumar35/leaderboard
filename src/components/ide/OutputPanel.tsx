interface OutputPanelProps {
  output: string;
  error: string;
  executionTime?: number;
  memoryUsed?: number;
}

export default function OutputPanel({ output, error, executionTime, memoryUsed }: OutputPanelProps) {
  return (
    <div className="bg-slate-900 rounded-lg p-4 h-full border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Output</h3>
        {executionTime !== undefined && (
          <div className="flex gap-4 text-sm text-gray-400">
            <span>Time: {executionTime}ms</span>
            {memoryUsed !== undefined && <span>Memory: {memoryUsed}KB</span>}
          </div>
        )}
      </div>
      <div className="font-mono text-sm">
        {error ? (
          <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
        ) : output ? (
          <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
        ) : (
          <p className="text-gray-500">Run your code to see output</p>
        )}
      </div>
    </div>
  );
}
