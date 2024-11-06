import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import useFetching from "../hooks/useFetching";
import ProfileService from "./API/ProfileService";
import '../styles/ProfileItem.css';

const ProfileItem = (props) => {
    const router = useNavigate();
    const [modal, setModal] = useState(false);
    const [profile, setProfile] = useState({});
    const [] = useFetching(async (id)=>{
        const response = await ProfileService.getbyId(id)
        setProfile(response)
    })
    return (
        <div className="profile-item">
            <div className="profile-photo-container">
                <img
                    src={props.profile.photo}
                    alt={`${props.profile.name} ${props.profile.surname}`}
                    className="profile-photo"
                />
            </div>
            <div className="profile-info">
                <strong>{props.profile.surname} {props.profile.name} {props.profile.patronymic}</strong>
                <p>Email: {props.profile.author ? props.profile.author.email : 'Email не указан'}</p>
                <p>Рабочий номер: {props.profile.work}</p>
                <p>Личный номер: {props.profile.personal}</p>
            </div>
        </div>
    )
};

export default ProfileItem;