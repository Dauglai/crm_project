function MentionNotifications({ notifications, onAccept, onDismiss }) {
    return (
        <div className="notifications">
            {notifications.map((notif) => (
                <div key={notif.id} className="notification">
                    <p>
                        Вы были упомянуты в комментарии: {notif.comment.text}
                    </p>
                    <button onClick={() => onAccept(notif.id)}>Принять</button>
                    <button onClick={() => onDismiss(notif.id)}>Отклонить</button>
                </div>
            ))}
        </div>
    );
}
