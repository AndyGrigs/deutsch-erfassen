import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }), // Replace '/api' with your backend base URL
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    updateCode: builder.mutation({
      query: (userData) => ({
        url: "/update-user-code",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useRegisterMutation, useUpdateCodeMutation } = api;
