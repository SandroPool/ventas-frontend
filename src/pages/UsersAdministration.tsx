import { FC, JSX } from "react";
import { Edit, CheckCircle, XCircle, UserPlus, SaveAll, LoaderPinwheel } from "lucide-react";
import { ButtonFuturistic, InputFuturistic, TitleFuturistic, ModalFuturistic, SelectFuturistic, SwitchFuturistic } from "../components";
import TableFuturistic, { Column } from "../components/TableFuturistic";
import { UserProfile, Role } from "../store/useAuthStore";
import { formatDate } from '../utils/functionDate';
import { useUsersAdministration } from "../hooks/useUsersAdministration";

const columns: Column<UserProfile>[] = [
    { key: "name", label: "Nombre" },
    { key: "email", label: "Correo Electrónico" },
    { key: "role", label: "Rol" },
    {
        key: "status",
        label: "Estado",
        render: (value) => (
            value ? (
                <span className="flex items-center gap-1 text-green-400">
                    <CheckCircle size={18} />
                </span>
            ) : (
                <span className="flex items-center gap-1 text-rose-400">
                    <XCircle size={18} />
                </span>
            )
        ),
    },
    {
        key: "createdAt",
        label: "Fecha de Creación",
        render: (value) => <span>{formatDate(value as string)}</span>
    },
];

const UsersAdministration: FC = (): JSX.Element => {
    const {
        users, loading, decodedToken,
        currentPage, setCurrentPage,
        totalPages,
        isEditModalOpen, setIsEditModalOpen,
        isRegisterModalOpen, setIsRegisterModalOpen,
        formData, setFormData,
        isFormValid,
        handleSearch,
        handleEdit,
        handleInputChange,
        handleSubmitEdit,
        handleRegisterUser,
    } = useUsersAdministration();

    return (
        <div className="px-4 lg:px-10 lg:pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <TitleFuturistic as="h1">Gestión de Usuarios</TitleFuturistic>
                <ButtonFuturistic
                    label="Nuevo Usuario"
                    icon={UserPlus}
                    className="w-full sm:w-auto px-4 py-2 text-sm"
                    onClick={() => {
                        setFormData({ name: "", email: "", role: Role.EMPLOYEE, status: false, password: "" });
                        setIsRegisterModalOpen(true);
                    }}
                />
            </div>

            <TableFuturistic
                columns={columns}
                data={users}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onSearch={handleSearch}
                loading={loading}
                actions={(user) => {
                    if (decodedToken.role === Role.ROOT) {
                        return (
                            <ButtonFuturistic
                                icon={Edit}
                                onClick={() => handleEdit(user)}
                                gradient="bg-teal-500"
                            />
                        );
                    }
                    if (decodedToken.role === Role.ADMIN) {
                        if (user.role !== Role.ROOT) {
                            return (
                                <ButtonFuturistic
                                    icon={Edit}
                                    onClick={() => handleEdit(user)}
                                    gradient="bg-teal-500"
                                />
                            );
                        }
                        return <></>;
                    }
                    return <></>;
                }}
            />

            <ModalFuturistic isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Usuario">
                <div className="flex flex-col gap-3">
                    <InputFuturistic label="Nombre" type="text" placeholder="nombre:" name="name" value={formData.name} onChange={handleInputChange} />
                    <InputFuturistic label="Correo Electrónico" type="email" placeholder="email@example.com" name="email" value={formData.email} onChange={handleInputChange} />
                    <SelectFuturistic
                        label="Rol"
                        options={[
                            { value: "", label: "Selecciona un rol" },
                            ...Object.values(Role)
                                .filter(role => role !== Role.ROOT)
                                .map(role => ({ label: role, value: role }))
                        ]}
                        value={formData.role || ""}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })} />
                    <SwitchFuturistic label="Estado" checked={formData.status} onChange={(checked) => setFormData({ ...formData, status: checked })} />
                    <InputFuturistic label="Nueva Contraseña" type="password" placeholder="nueva contraseña:(opcional)" name="password" value={formData.password} onChange={handleInputChange} />
                    <ButtonFuturistic
                        label={loading ? "" : "Actualizar Usuario"}
                        onClick={handleSubmitEdit}
                        gradient="bg-teal-500"
                        disabled={!isFormValid || loading}
                        icon={loading ? LoaderPinwheel : SaveAll} />
                </div>
            </ModalFuturistic>

            <ModalFuturistic isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title="Registrar Nuevo Usuario">
                <div className="flex flex-col gap-3">
                    <InputFuturistic label="Nombre" type="text" placeholder="nombre:" name="name" value={formData.name} onChange={handleInputChange} />
                    <InputFuturistic label="Correo Electrónico" type="email" placeholder="email@example.com" name="email" value={formData.email} onChange={handleInputChange} />
                    <InputFuturistic label="Contraseña" type="password" name="password" placeholder="contraseña:" value={formData.password} onChange={handleInputChange} />
                    <SelectFuturistic
                        label="Rol"
                        options={Object.values(Role)
                            .filter(role => role !== Role.ROOT)
                            .map(role => ({ label: role, value: role }))} value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })} />
                    <ButtonFuturistic
                        label={loading ? "" : "Registrar Usuario"}
                        onClick={handleRegisterUser}
                        disabled={!isFormValid || loading}
                        icon={loading ? LoaderPinwheel : SaveAll} />
                </div>
            </ModalFuturistic>
        </div>
    );
};

export default UsersAdministration;
