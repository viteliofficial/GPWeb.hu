// Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyC40hXX0N67X6TeT_IshAD-MjtlvmlWSeY",
            authDomain: "gp-web-rating.firebaseapp.com",
            projectId: "gp-web-rating",
            storageBucket: "gp-web-rating.appspot.com",
            messagingSenderId: "558006730604",
            appId: "1:558006730604:web:f87460ac4ab7776ffbbd49",
            measurementId: "G-NTJ4K7W5WQ"
        };

        // Initialize Firebase
        const app = firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        document.addEventListener('DOMContentLoaded', () => {
            const ratingDiv = document.getElementById('rating');
            const ratingButtons = ratingDiv.querySelectorAll('button');
            const averageDiv = document.getElementById('average');
            
            // Check if rating was already done
            if (localStorage.getItem('ratingDone')) {
                ratingButtons.forEach(button => button.disabled = true);
            }

            // Function to update the average display
            const updateAverageDisplay = async () => {
                const doc = await db.collection('ratings').doc('summary').get();
                if (doc.exists) {
                    const data = doc.data();
                    const totalRatings = data.totalRatings;
                    const totalSum = data.totalSum;
                    const average = (totalRatings > 0) ? (totalSum / totalRatings).toFixed(2) : 0;
                    averageDiv.textContent = `Average Rating: ${average}`;
                } else {
                    averageDiv.textContent = `Average Rating: 0`;
                }
            };

            updateAverageDisplay();

            ratingButtons.forEach(button => {
                button.addEventListener('click', async (event) => {
                    const rating = parseInt(event.target.getAttribute('data-rating'));

                    if (!localStorage.getItem('ratingDone')) {
                        const ratingDoc = db.collection('ratings').doc('summary');

                        try {
                            await db.runTransaction(async (transaction) => {
                                const doc = await transaction.get(ratingDoc);

                                if (!doc.exists) {
                                    transaction.set(ratingDoc, {
                                        '1_star': 0,
                                        '2_star': 0,
                                        '3_star': 0,
                                        '4_star': 0,
                                        '5_star': 0,
                                        totalRatings: 0,
                                        totalSum: 0
                                    });
                                }

                                const data = doc.data();
                                const newRatingCount = (data[`${rating}_star`] || 0) + 1;
                                const newTotalRatings = (data.totalRatings || 0) + 1;
                                const newTotalSum = (data.totalSum || 0) + rating;

                                transaction.update(ratingDoc, {
                                    [`${rating}_star`]: newRatingCount,
                                    totalRatings: newTotalRatings,
                                    totalSum: newTotalSum
                                });
                            });

                            // Store the rating done flag in localStorage
                            localStorage.setItem('ratingDone', 'true');

                            // Disable all buttons
                            ratingButtons.forEach(button => button.disabled = true);

                            updateAverageDisplay();
                        } catch (error) {
                            console.error("Error saving rating: ", error);
                        }
                    }
                });
            });
        });