function MentionNotifications({ notifications, onAccept, onDismiss }) {
    return (
        <div>
            <h3>Уведомления</h3>
            {notifications.length > 0 ? (
                notifications.map((notif) => (
                    <div key={notif.id} className="notification">
                        <p>{notif.comment_text}</p>
                        <button onClick={() => markAsRead(notif.id)}>Прочитано</button>
                    </div>
                ))
            ) : (
                <p>Нет новых уведомлений</p>
            )}
        </div>
    );
}

export default MentionNotifications;