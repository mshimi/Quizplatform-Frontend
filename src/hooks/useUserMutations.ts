import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../service/userService';
import type { UpdateProfileRequest, User } from '../types';

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,

        // --- Optimistic Update Logic ---
        onMutate: async (newProfileData: UpdateProfileRequest) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: ['currentUser'] });

            // Snapshot the previous value
            const previousUser = queryClient.getQueryData<User>(['currentUser']);

            // Optimistically update to the new value
            if (previousUser) {
                queryClient.setQueryData<User>(['currentUser'], {
                    ...previousUser,
                    ...newProfileData,
                });
            }

            // Return a context object with the snapshotted value
            return { previousUser };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, _newProfileData, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(['currentUser'], context.previousUser);
            }
            console.error("Profile update failed:", err);
            // Here you would show an error toast
        },
        // Always refetch after error or success to ensure data consistency
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });
};