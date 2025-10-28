import React, { useState, useEffect } from "react";
import { profileAPI } from "../../../../utils/api";
import { Link } from "react-router-dom";

const SearchProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      const res = await profileAPI.getAllProfiles();
      setProfiles(res.data);
    };
    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter(p =>
    p.user.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search users or companies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div>
        {filteredProfiles.map((p) => (
          <Link key={p.user._id} to={`/profile/${p.user._id}`}>
            <div>
              <h3>{p.user.name}</h3>
              <p>{p.headline}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchProfiles;
