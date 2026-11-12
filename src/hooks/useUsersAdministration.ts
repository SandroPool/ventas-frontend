import { useCallback, useEffect, useState } from "react";
import { useAuthStore, UserProfile, Role } from "../store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { validateEmail } from "../utils/validateEmail";

export const useUsersAdministration = () => {
    const { token, users, loading, fetchUsers, updateUser, deleteUser, registerUser } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: Role.EMPLOYEE, status: false, password: "" });
    const [isFormValid, setIsFormValid] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const decodedToken = token ? jwtDecode<{ id: number; role: string }>(token) : { id: 0, role: '' };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUsers(currentPage, pageSize, searchTerm);
            const pagination = useAuthStore.getState().pagination;
            if (pagination) {
                setTotalPages(pagination.totalPages);
            }
        };
        fetchData();
    }, [fetchUsers, searchTerm, currentPage, pageSize]);

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
            fetchUsers(currentPage, pageSize, searchTerm);
            setIsEditModalOpen(false);
        }
    };

    const handleRegisterUser = async () => {
        const success = await registerUser(formData);
        if (success) {
            fetchUsers(currentPage, pageSize, searchTerm);
            setIsRegisterModalOpen(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        const success = await deleteUser(userToDelete.id_user);
        if (success) {
            const updatedPagination = useAuthStore.getState().pagination;
            const page = Math.min(currentPage, updatedPagination?.totalPages ?? currentPage);
            if (page !== currentPage) setCurrentPage(page);
            await fetchUsers(page, pageSize, searchTerm);
            setTotalPages(useAuthStore.getState().pagination?.totalPages ?? 1);
        }
        setUserToDelete(null);
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
        pageSize, setPageSize,
        totalPages, setTotalPages,
        isEditModalOpen, setIsEditModalOpen,
        isRegisterModalOpen, setIsRegisterModalOpen,
        selectedUser, setSelectedUser,
        userToDelete, setUserToDelete,
        formData, setFormData,
        isFormValid,
        handleSearch,
        handleEdit,
        handleInputChange,
        handleSubmitEdit,
        handleRegisterUser,
        handleConfirmDelete,
    };
};
