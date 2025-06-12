import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export default function Transactions() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) return;

      setLoading(true);
      try {
        const signatures = await connection.getSignaturesForAddress(publicKey, {
          limit: 10,
        });

        const parsedTxns = await connection.getParsedTransactions(
          signatures.map((sig) => sig.signature),
          { maxSupportedTransactionVersion: 0 }
        );

        setTxns(parsedTxns.filter(Boolean));
      } catch (err) {
        console.error("🚨 Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [publicKey, connection]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4 text-indigo-700">🔄 Recent Transactions</h1>

      {loading ? (
        <p className="text-indigo-500 font-medium">Fetching transactions...</p>
      ) : txns.length === 0 ? (
        <p className="text-gray-600">No recent transactions found.</p>
      ) : (
        <ul className="space-y-4">
          {txns.map((tx, index) => {
            const signature = tx?.transaction?.signatures?.[0] ?? 'N/A';
            const status = tx?.meta?.err ? '❌ Failed' : '✅ Success';
            const statusColor = tx?.meta?.err ? 'text-red-600' : 'text-green-600';
            const date = tx?.blockTime
              ? new Date(tx.blockTime * 1000).toLocaleString()
              : 'Unknown';

            return (
              <li key={index} className="border rounded p-4 bg-gray-50">
                <p className="text-sm break-words">
                  <strong>Signature:</strong>{' '}
                  <a
                    href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {signature}
                  </a>
                </p>
                <p className={`text-sm mt-1 font-medium ${statusColor}`}>
                  <strong>Status:</strong> {status}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Slot:</strong> {tx?.slot ?? 'Unknown'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Time:</strong> {date}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
