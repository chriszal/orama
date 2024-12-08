import { useEffect, useState } from "react";
import { getFirestore } from "@/config/firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchTopContributors = async () => {
      const db = getFirestore();
      const userUploadsRef = collection(db, "UserUploads");
      const q = query(
        userUploadsRef,
        where("metadata.user_name", "!=", "Anonymous") // Basic query to exclude Anonymous
      );

      const snapshot = await getDocs(q);
      const contributions = {};

      snapshot.forEach((doc) => {
        const userName = doc.data().metadata.user_name.toLowerCase(); // Convert to lowercase

        // Filter out "anonymous" and "test"
        if (userName !== "anonymous" && userName !== "test") {
          contributions[userName] = (contributions[userName] || 0) + 1;
        }
      });

      const sortedUsers = Object.entries(contributions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([userName, count]) => ({ userName, count }));

      setTopUsers(sortedUsers);
    };

    fetchTopContributors();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        Top Contributors
      </h2>
      <div className="flex justify-center items-end gap-4">
        {/* Rearrange topUsers to enforce correct positions */}
        {[
          topUsers[1], // 2nd place on the left
          topUsers[0], // 1st place in the center
          topUsers[2], // 3rd place on the right
        ].map((user, index) => {
          if (!user) return null; // Handle cases with fewer than 3 users

          // Assign gradients based on position and theme
          const gradientClass =
            index === 1
              ? "bg-gradient-to-br from-yellow-500 to-yellow-300 dark:from-yellow-600 dark:to-yellow-400" // Gold for 1st
              : index === 0
              ? "bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-700 dark:to-gray-900" // Silver for 2nd
              : "bg-gradient-to-br from-orange-700 to-orange-500 dark:from-orange-800 dark:to-orange-600"; // Darker Bronze for 3rd

          // Container height: 1st place taller
          const heightClass = index === 1 ? "h-56" : "h-48";

          // Medal Emojis
          const medalEmoji = index === 1 ? "🥇" : index === 0 ? "🥈" : "🥉";

          return (
            <div
              key={user.userName}
              className={`relative flex flex-col items-center rounded-lg p-4 ${gradientClass} ${heightClass} w-32 hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out`}
            >
              {/* Medal Emoji */}
              <div className="absolute top-2 left-2 text-2xl">{medalEmoji}</div>
              {/* Upload Count */}
              <div className="flex flex-col items-center justify-center mt-6">
                <span className="text-white text-3xl font-bold">
                  {user.count}
                </span>
                <span className="text-gray-200 text-sm">uploads</span>
              </div>
              {/* Username */}
              <div className="mt-auto text-center text-white font-semibold text-lg">
                {user.userName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
