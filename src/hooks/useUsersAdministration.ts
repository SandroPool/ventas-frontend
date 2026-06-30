import { useCallback, useEffect, useState } from "react";
import { useAuthStore, UserProfile, Role } from "../store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { validateEmail } from "../utils/validateEmail";

export const useUsersAdministration = () => {
    const { token, users, loading, fetchUsers, updateUser, registerUser } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: Role.EMPLOYEE, status: false, password: "" });
    const [isFormValid, setIsFormValid] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const decodedToken = token ? jwtDecode<{ id: number; role: string }>(token) : { id: 0, role: '' };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUsers(currentPage, 10, searchTerm);
            const pagination = useAuthStore.getState().pagination;
            if (pagination) {
                setTotalPages(pagination.totalPages);
            }
        };
        fetchData();
    }, [fetchUsers, searchTerm, currentPage]);

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
        setCurrentPage(1);
    };

    const handleEdit = (user: UserProfile) => {
        setSelectedUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role, status: user.status, password: "" });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmitEdit = async () => {
        if (selectedUser) {
            const updatedData: Partial<UserProfile & { password?: string }> = {
                name: formData.name,
                email: formData.email,
                role: formData.role as Role,
                status: formData.status,
            };
            if (formData.password.trim()) {
                updatedData.password = formData.password;
            }
            await updateUser(selectedUser.id_user, updatedData);
            fetchUsers(currentPage, 10, searchTerm);
            setIsEditModalOpen(false);
        }
    };

    const handleRegisterUser = async () => {
        const success = await registerUser(formData);
        if (success) {
            fetchUsers(currentPage, 10, searchTerm);
            setIsRegisterModalOpen(false);
        }
    };

    const validateForm = useCallback(() => {
        const { name, email, password, role } = formData;
        const isValid =
            name.trim() !== "" &&
            email.trim() !== "" &&
            validateEmail(email) &&
            role !== undefined &&
            (isRegisterModalOpen ? password.trim() !== "" : true);
        setIsFormValid(isValid);
    }, [formData, isRegisterModalOpen]);

    useEffect(() => {
        validateForm();
    }, [validateForm]);

    return {
        users, loading, decodedToken,
        searchTerm, setSearchTerm,
        currentPage, setCurrentPage,
        totalPages, setTotalPages,
        isEditModalOpen, setIsEditModalOpen,
        isRegisterModalOpen, setIsRegisterModalOpen,
        selectedUser, setSelectedUser,
        formData, setFormData,
        isFormValid,
        handleSearch,
        handleEdit,
        handleInputChange,
        handleSubmitEdit,
        handleRegisterUser,
    };
};
