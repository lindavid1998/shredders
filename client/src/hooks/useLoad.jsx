import React, { useEffect, useState } from 'react';

export const useLoad = (fetchData) => {
	// custom hook for managing loading state
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchDataWrapper = async () => {
      try {
        // wait for API call to finish
				await fetchData();
			} catch (error) {
				console.log(error);
      }
      // set loading state to false
			setIsLoading(false);
		};

		fetchDataWrapper();
	}, []);

	return isLoading;
};
