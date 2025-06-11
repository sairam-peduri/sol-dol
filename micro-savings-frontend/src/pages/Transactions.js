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
        const transactions = await connection.getParsedTransactions(sigs.map((s) => s.signature));
        setTxns(transactions.filter(t => t !== null)); // remove nulls
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [publicKey, connection]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Recent Transactions</h1>

      {loading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : txns.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <ul className="space-y-4">
          {txns.map((t, i) => (
            <li key={i} className="border rounded p-4 bg-gray-50">
              <p className="break-words text-sm">
                <strong>Signature:</strong> {t.transaction.signatures[0]}
              </p>
              <p className={`text-sm mt-1 ${t.meta.err ? 'text-red-600' : 'text-green-600'}`}>
                <strong>Status:</strong> {t.meta.err ? 'Failed' : 'Success'}
              </p>
              <p className="text-sm mt-1 text-gray-500">
                <strong>Slot:</strong> {t.slot}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
