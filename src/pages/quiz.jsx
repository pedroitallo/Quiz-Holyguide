import React, { useEffect, useState } from 'react';
import { ABTest } from '@/api/entities';
import { createPageUrl } from '@/utils';

export default function Quiz() {
    const [error, setError] = useState('');

    useEffect(() => {
        const performRedirect = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const testSlug = urlParams.get('test');

                if (!testSlug) {
                    setError('Nenhum teste A/B especificado.');
                    return;
                }

                const [testConfig] = await ABTest.filter({ testSlug: testSlug, isActive: true });

                if (!testConfig) {
                    setError(`Teste A/B "${testSlug}" não encontrado ou inativo.`);
                    return;
                }

                const storageKey = 'ab-test-assignments';
                let assignments = {};
                try {
                    const storedAssignments = localStorage.getItem(storageKey);
                    if (storedAssignments) {
                        assignments = JSON.parse(storedAssignments);
                    }
                } catch (e) {
                    console.warn("Could not parse A/B test assignments from localStorage.");
                    assignments = {};
                }

                let finalSlug;
                const assignedGroup = assignments[testSlug];

                if (assignedGroup === 'A') {
                    finalSlug = testConfig.slugA;
                } else if (assignedGroup === 'B') {
                    finalSlug = testConfig.slugB;
                } else {
                    // Not assigned yet, run split logic
                    const random = Math.random() * 100;
                    if (random < testConfig.splitA) {
                        finalSlug = testConfig.slugA;
                        assignments[testSlug] = 'A';
                    } else {
                        finalSlug = testConfig.slugB;
                        assignments[testSlug] = 'B';
                    }
                    localStorage.setItem(storageKey, JSON.stringify(assignments));
                }

                // Redirect to the determined page
                const targetUrl = createPageUrl(finalSlug);
                window.location.replace(targetUrl);

            } catch (err) {
                console.error("A/B Test Redirect Error:", err);
                setError('Ocorreu um erro ao processar o redirecionamento.');
            }
        };

        performRedirect();
    }, []);

    // If there's an error, we display it. Otherwise, the page is blank while redirecting.
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Erro no Redirecionamento</h1>
                    <p className="text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    return null; // Return null to show a blank page during the redirect process
}