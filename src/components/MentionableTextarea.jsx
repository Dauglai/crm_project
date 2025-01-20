import {useEffect, useState} from "react";
import axios from "axios";

const MentionableTextarea = ({ value, onChange, mentions, setMentions }) => {
    const [profiles, setProfiles] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (query && query.trim()) {
            axios.get(`http://localhost:8000/accounts/search_profiles/?search=${query}`)
                .then((response) => setProfiles(response.data.results))
                .catch((error) => console.error("Error fetching profiles", error));
        } else {
            setProfiles([]);
        }
    }, [query]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Проверка на наличие упоминания через @
        const match = newValue.match(/@(\w+)$/);
        if (match && match[1]) {
            setQuery(match[1].toLowerCase());
        } else {
            setQuery(""); // Сбросить, если нет упоминания
        }
    };

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
                onChange={handleInputChange}
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
