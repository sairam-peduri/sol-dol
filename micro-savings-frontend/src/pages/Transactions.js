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
        const sigs = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
        const transactions = await connection.getParsedTransactions(
          sigs.map((s) => s.signature)
        );

        const filtered = transactions.filter(Boolean); // remove nulls
        setTxns(filtered);
      } catch (error) {
        console.error('Error fetching transactions:', error);
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
        <div className="text-indigo-500 font-medium">Fetching transactions...</div>
      ) : txns.length === 0 ? (
        <p className="text-gray-600">No recent transactions found.</p>
      ) : (
        <ul className="space-y-4">
          {txns.map((t, i) => {
            const signature = t.transaction?.signatures?.[0];
            const status = t.meta?.err ? 'Failed ❌' : 'Success ✅';
            const statusColor = t.meta?.err ? 'text-red-600' : 'text-green-600';
            const date = t.blockTime ? new Date(t.blockTime * 1000).toLocaleString() : 'Unknown';

            return (
              <li key={i} className="border rounded p-4 bg-gray-50">
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
                  <strong>Slot:</strong> {t.slot}
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
