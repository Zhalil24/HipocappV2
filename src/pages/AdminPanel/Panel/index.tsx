import React, { useEffect, useState } from "react";
import AdminHeader from "@/layout/layouts/AdminPanel/Header";
import { AdminFooter } from "@/layout/layouts/AdminPanel/Footer";
import AdminSidebar from "@/layout/layouts/AdminPanel/Sidebar";
import { UserDataModel } from "@/core/models/user/userDataModel";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { DegreeChart } from "@/components/DegreeChart";
import { clearMessage, fetchLastEntries } from "@/store/slices/entrySlice";
import { addContent, createGroup, createRole, deleteAllEntry, deleteContent, deleteEntry, deleteMemberFromGroup, deleteRole, deleteUser, editRole, fetchApprovedGroupsMemberRequest, fetchContent, fetchEntries, fetchGetGroups, fetchGroupsMemberRequest, fetchModuleRole, fetchRoles, fetchUserCount, fetchUserList, fetchUsersCountByDegreeId, registerUser, updateContent, updateRquestState, updateUser, updateUserStatus } from "@/store/slices/adminSlice";
import { AdminMenuConstants, CrudOperation, Item } from "@/Utilities/constants/panelItems";
import { ContentList } from "@/components/ContentList";
import { ContentModel } from "@/core/models/content/contentModel";
import { ContentModal } from "@/components/ContentModal";
import { Endpoints } from "@/Utilities/enums/Endpoints";
import { AdminMenuType, EndpointMappings } from "@/Utilities/enums/AminMenuType";
import { ToastContainer, toast } from "react-toastify";
import { EntryList } from "@/components/EntryList";
import LoadingWidget from "@/components/Loading/loadingWidget";
import { UserList } from "@/components/UserList";
import RoleList from "@/components/RoleList";
import { RoleDTO } from "@/core/models/role/roleModel";
import GroupMemberRequestsTable from "@/components/GroupMemberRequestList";
import GroupApprovedMemberRequestsTable from "@/components/GroupApprovedMemberRequest";
import { GetGroupsMemberRequest } from "@/core/models/groupMemberRequest/groupMemberRequestModel";
import AdminGroupsTable from "@/components/GroupListTable";
import { GroupModel } from "@/core/models/chatMessage/messageModel";

export default function AdminPanel() {
    const dispatch = useDispatch<AppDispatch>();
    const adminState = useSelector((state: RootState) => state.admin);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userString = localStorage.getItem("user");
    let user: UserDataModel | null = null;
    user = userString ? (JSON.parse(userString) as UserDataModel) : null;
    const [selectedContent, setSelectedContent] = useState<ContentModel | null>(null);
    const [newContent, setNewContent] = useState<boolean>(false);
    const [activeItemType, setActiveItemType] = useState<AdminMenuType | null>(null);
    const [Endpoints, setEndpoints] = useState<Endpoints | null>(null);
    const [operation, setOperation] = useState<CrudOperation | null>(null);
    const [authorizedRoleId, setAuthorizedRoleId] = useState<number | null>(null);


    useEffect(() => {
        dispatch(fetchLastEntries());
        dispatch(fetchUserCount());
        dispatch(fetchUsersCountByDegreeId());
    }, [dispatch]);

    const handleItemSelected = (item: Item | null) => {
        if (!item) return;
        setActiveItemType(item.type ?? null);
        let foundEndpoint: Endpoints | null = null;
        let foundOperation: CrudOperation | null = null;
        if (item.type && item.operation) {
            const parent = AdminMenuConstants.items.find((x) => x.type === item.type);
            const endpointConfig = parent?.children
                ?.flatMap((c) => c.endpoints)
                .find((e) => e.operation === item.operation);
            foundEndpoint = endpointConfig?.endpoint ?? null;
            foundOperation = endpointConfig?.operation ?? null;
        }
        setEndpoints(foundEndpoint);
        setOperation(foundOperation);
    };


    const handleContentUpdate = async (updated: ContentModel) => {
        if (!activeItemType) return;
        const updateEndpoint = EndpointMappings[activeItemType]?.update;
        if (!updateEndpoint) return;
        await dispatch(updateContent({ url: updateEndpoint, data: updated })).unwrap();
        setSelectedContent(null);
    };

    const handleContentDelete = async (item: ContentModel) => {
        if (!activeItemType) return;
        const deleteEndpoint = EndpointMappings[activeItemType]?.delete;
        if (!deleteEndpoint) return;
        await dispatch(deleteContent({ apiUrl: deleteEndpoint, id: item.id })).unwrap();
    };

    const handleContentAdd = async (newItem: ContentModel) => {
        if (!activeItemType) return;
        const addEndpoint = EndpointMappings[activeItemType]?.create;
        if (!addEndpoint) return;
        await dispatch(
            addContent({ apiUrl: addEndpoint, data: newItem })
        ).unwrap();
    };

    const handlePageChange = (newPage: number) => {
        if (!activeItemType || !Endpoints || !operation) return;

        if (activeItemType === AdminMenuType.Entries) {
            dispatch(fetchEntries({ id: 0, page: newPage }));
            return;
        }

        if (activeItemType === AdminMenuType.Users) {
            dispatch(fetchUserList({
                apiUrl: Endpoints,
                data: { id: 0, page: newPage },
            }));
            return;
        }

        if (activeItemType === AdminMenuType.Groups) {
            if (operation === "list") {
                dispatch(fetchGroupsMemberRequest({
                    data: { id: 0, page: newPage },
                }))
                return;
            }
            else if (operation === "list2") {
                dispatch(fetchApprovedGroupsMemberRequest({
                    data: { id: 0, page: newPage },
                }))

                return;
            }
            else if (operation === "create") {
                dispatch(fetchGetGroups())
                return;
            }
            return;
        }
    };
    const handleEntryDelete = (id: number) => {
        dispatch(deleteAllEntry(id))
    }

    const handleUserDelete = (userId: number) => {
        dispatch(deleteUser({ id: userId, page: 0 }));
    }

    const handleUserUpdate = (model: UserDataModel) => {
        dispatch(updateUser(model))
    }

    const handleUserUpdateStatus = (userId: number) => {
        dispatch(updateUserStatus(userId))
    }
    const handleCreateUser = async (userData: Partial<UserDataModel>) => {
        const formData = new FormData();
        if (userData.userName) formData.append("userName", userData.userName);
        if (userData.name) formData.append("name", userData.name);
        if (userData.surname) formData.append("surname", userData.surname);
        if (userData.email) formData.append("email", userData.email);
        if (userData.phoneNumber) formData.append("phoneNumber", userData.phoneNumber.toString());
        if (userData.identityNumber) formData.append("identityNumber", userData.identityNumber);
        if (userData.password) formData.append("password", userData.password);
        if (userData.degreeId) formData.append("degreeId", userData.degreeId.toString());
        if (userData.passwordRe) formData.append("PasswordRepeat", userData.passwordRe);
        if (userData.image) {
            formData.append("image", userData.image as File);
        }
        dispatch(registerUser(formData))
    };

    const handleRoleCreate = async (role: RoleDTO) => {
        await dispatch(createRole(role));
        dispatch(fetchRoles());
    };

    const handleRoleDelete = (roleId: number) => {
        dispatch(deleteRole({ id: roleId, page: 0 }));
    };
    const handleGroupMemberRequestUpdate = (model: GetGroupsMemberRequest) => {
        dispatch(updateRquestState(model));
    };

    const handleCreateGroup = (model: GroupModel) => {
        dispatch(createGroup(model));
    }

    const handleDeleteGroupToMember = (payload: { groupId: number; userId: number }) => {
        const { groupId, userId } = payload;
        dispatch(deleteMemberFromGroup({ groupId, userId }));
    };

    useEffect(() => {
        handlePageChange(0)
    }, [activeItemType, operation, Endpoints]);

    useEffect(() => {
        dispatch(fetchContent(Endpoints!));
        dispatch(fetchRoles());
        dispatch(fetchModuleRole(1));
        //Burada kaldımm static değeri dinamik hale getirelecek
    }, [Endpoints])

    useEffect(() => {
        if (adminState.message) {
            toast.success(adminState.message);
            dispatch(clearMessage());
        }
    }, [adminState.message, dispatch]);

    const isModalOpen = !!selectedContent || !!newContent;


    const renderContentComponent = () => {
        if (adminState.loading) {
            return <LoadingWidget isLight={true} />;
        }
        switch (activeItemType) {
            case AdminMenuType.Entries:
                if (!adminState.allEntries) return <LoadingWidget isLight={true} />;
                return (
                    <EntryList
                        pagination={adminState.allEntries}
                        onPageChange={handlePageChange}
                        onDelete={handleEntryDelete}
                    />
                );
            case AdminMenuType.Roles:
                if (!adminState.roles) return <LoadingWidget isLight={true} />;

                return (
                    <RoleList
                        onAuthorize={() => { }}
                        onAdd={handleRoleCreate}
                        onDelete={handleRoleDelete}
                        roles={adminState.roles}
                        onSelectionChange={() => { }}
                        roleModelResponse={adminState.moduleRoles!}
                        onAuthorizeClick={(roleId) => { setAuthorizedRoleId(roleId) }}
                    />
                )
            case AdminMenuType.Groups:
                if (operation === "list") {
                    if (!adminState.pendingGroupMemberRequest?.items?.length) {
                        return <p className="text-center text-gray-500">Gösterilecek kullanıcı yok</p>;
                    }

                    return (
                        <GroupMemberRequestsTable
                            data={adminState.pendingGroupMemberRequest.items}
                            onApprove={handleGroupMemberRequestUpdate}
                            onPageChange={handlePageChange}
                            onReject={handleGroupMemberRequestUpdate}
                            pagination={adminState.pendingGroupMemberRequest}
                        />
                    );
                }

                if (operation === "list2") {
                    if (!adminState.approvedGroupMemberRequest?.items?.length) {
                        return <p className="text-center text-gray-500">Gösterilecek onaylanmış kullanıcı yok</p>;
                    }

                    return (
                        <GroupApprovedMemberRequestsTable
                            data={adminState.approvedGroupMemberRequest.items}
                            onDelete={handleDeleteGroupToMember}
                            onPageChange={handlePageChange}
                            pagination={adminState.approvedGroupMemberRequest}
                        />
                    );
                }

                if (operation === "create") {


                    return (
                        <AdminGroupsTable
                            groups={adminState.groups ?? []}
                            onAddGroup={handleCreateGroup}
                        />
                    );
                }

                return null;

            case AdminMenuType.Users:
                if (adminState.loading) return <LoadingWidget isLight={true} />;
                if (!adminState.allUsers || adminState.allUsers.items.length === 0) {
                    return <p className="text-center text-gray-500">Gösterilecek kullanıcı yok</p>;
                }
                if (operation === "list") {
                    return (
                        <UserList
                            pagination={adminState.allUsers}
                            onPageChange={handlePageChange}
                            onDelete={handleUserDelete}
                            onEdit={handleUserUpdate}
                            onCreate={handleCreateUser}
                            variant="all"
                        />
                    );
                }
                if (operation === "list2") {
                    return (
                        <UserList
                            pagination={adminState.allUsers}
                            onPageChange={handlePageChange}
                            onReject={handleUserDelete}
                            onApprove={handleUserUpdateStatus}
                            variant="unapproved"
                        />
                    );
                }
                return null;

            case AdminMenuType.Jobs:
            case AdminMenuType.Market:
            case AdminMenuType.Partners:
            case AdminMenuType.Trainings:
                if (!adminState.content) return <LoadingWidget isLight={true} />;
                return (
                    <ContentList
                        data={adminState.content}
                        onEdit={(item) => setSelectedContent(item)}
                        onDelete={(item) => handleContentDelete(item)}
                        onAddModalChange={(isOpen) => setNewContent(isOpen)}
                    />
                );

            default:
                return <p>Seçili bir içerik yok</p>;
        }
    };


    return (
        <div className="min-h-dvh bg-gray-50 text-gray-900 antialiased dark:bg-neutral-950 dark:text-gray-100 flex flex-col">
            <AdminHeader user={user!} />
            <div className="flex flex-1">
                <AdminSidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                    items={AdminMenuConstants.items}
                    onItemSelected={handleItemSelected}
                />
                <main className="flex-1 px-3 sm:px-6">
                    <div className="h-4" />

                    {Endpoints ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-neutral-900">
                            {renderContentComponent()}
                            {(selectedContent || newContent) && (
                                <ContentModal
                                    isOpen={isModalOpen}
                                    content={selectedContent ?? undefined}
                                    onClose={() => {
                                        setSelectedContent(null);
                                        setNewContent(false);
                                    }}
                                    onSubmit={selectedContent ? handleContentUpdate : handleContentAdd}
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            {adminState.loading ? (
                                <LoadingWidget isLight={true} />
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <div className="relative rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg dark:from-indigo-600 dark:to-purple-700">
                                            <div className="absolute top-4 right-4 text-white/50">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>
                                            <div className="mb-6">
                                                <h2 className="text-xl font-semibold mb-2 opacity-80">Toplam Kullanıcı</h2>
                                                <p className="text-4xl font-bold">{adminState.userCount ?? "-"}</p>
                                            </div>
                                            {user && (
                                                <div className="border-t border-white/20 pt-4">
                                                    <h3 className="text-md font-semibold text-white/80">Admin:</h3>
                                                    <p className="text-sm font-light text-white/70"><span className="font-semibold">Kullanıcı Adı:</span> {user.userName}</p>
                                                    <p className="text-sm font-light text-white/70"><span className="font-semibold">Ad Soyad:</span> {user.name} {user.surname}</p>
                                                    <p className="text-sm font-light text-white/70"><span className="font-semibold">E-posta:</span> {user.email}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-neutral-900">
                                            <h2 className="text-lg font-semibold mb-2">Kullanıcıların Degree Dağılımı</h2>
                                            {adminState.degrees && adminState.degrees.length > 0 ? (
                                                <DegreeChart data={adminState.degrees} />
                                            ) : (
                                                <p>Veri bulunamadı</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Son entryler */}
                                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-neutral-900">
                                        <h2 className="text-lg font-semibold mb-4">Son Entry'ler</h2>
                                        {adminState.lastEntries && adminState.lastEntries.length > 0 ? (
                                            <ul className="space-y-4">
                                                {adminState.lastEntries.map((entry, i) => (
                                                    <li key={i} className="flex items-start justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                                                        <div className="flex-1 pr-4">
                                                            <p className="font-medium text-gray-900 dark:text-white">{entry.titleName}</p>
                                                            <p className="text-sm text-gray-500">{entry.entryDescription}</p>
                                                            <p className="text-xs text-gray-400 mt-1">Yazar: {entry.userName}</p>
                                                        </div>
                                                        <button
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                            onClick={() => { dispatch(deleteEntry(entry.id)) }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                                            </svg>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">Veri bulunamadı.</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </>

                    )}
                    <div className="h-8" />
                </main>
            </div>

            <AdminFooter />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}