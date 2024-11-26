import React, { useState, useEffect } from "react";
import axios from "axios";

const MentionableTextarea = ({ value, onChange, mentions, setMentions }) => {
    const [profiles, setProfiles] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (query.trim()) {
            axios.get(`http://localhost:8000/accounts/search_profiles/?q=${query}`)
                .then((response) => setProfiles(response.data.results))
                .catch((error) => console.error("Error fetching profiles", error));
        } else {
            setProfiles([]);
        }
    }, [query]);

    const handleMention = (profile) => {
        setMentions([...mentions, profile]);
        onChange(value + ` @${profile.name}`);
        setQuery("");
        setProfiles([]);
    };

    return (
        <div>
            <textarea
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    const match = e.target.value.match(/@(\w+)$/);
                    if (match) setQuery(match[1]);
                }}
                placeholder="Введите комментарий с @ для упоминания"
            />
            {profiles.length > 0 && (
                <ul className="autocomplete-list">
                    {profiles.map(profile => (
                        <li key={profile.id} onClick={() => handleMention(profile)}>
                            {profile.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MentionableTextarea;
