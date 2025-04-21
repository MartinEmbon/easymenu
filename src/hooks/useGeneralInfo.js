// src/hooks/useGeneralInfo.js
import { useState, useEffect } from "react";
import axios from "axios";

const endpointBase = 'https://get-general-info-336444799661.us-central1.run.app';

export const useGeneralInfo = (clienteId) => {
  const [generalInfo, setGeneralInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInfo = async () => {
      if (!clienteId) {
        setError('clienteId is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${endpointBase}/getGeneralInfo`, {
          params: { clienteId },
        });

        if (response.data && response.data.generalInfo) {
          setGeneralInfo(response.data.generalInfo);
        } else {
          setError('No data found');
        }
      } catch (err) {
        setError('Failed to load general info');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [clienteId]);

  return { generalInfo, loading, error };
};
