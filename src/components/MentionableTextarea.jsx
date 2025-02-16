import {useEffect, useState} from "react";
import axios from "axios";
import TaskIdComment from "./TaskId/TaskIdComment";

const MentionableTextarea = ({ value, onChange, recipient, setRecipient }) => {
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/accounts/profiles/`)
            .then((response) => setProfiles(response.data.results))
            .catch((error) => console.error("Error fetching profiles", error));
    }, []);


    return (
        <div>
            <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder="Введите комментарий" />
            <select onChange={(e) => setRecipient(e.target.value)}>
                <option value="">Выберите получателя (необязательно)</option>
                {profiles.map(profile => (
                    <option key={profile.user.id} value={profile.user.id}>{profile.name}</option>
                ))}
            </select>
        </div>
    );
};

export default MentionableTextarea;