<label>
    Адресат
    <select
        name="addressee"
        value={taskData.addressee}
        onChange={handleChange}
    >
        <option value="">Выберите адресата</option>
        {profiles.map(user => (
            <option key={user.author.id} value={user.author.id}>
                {user.surname} {user.name} {user.patronymic}
            </option>
        ))}
    </select>
</label>