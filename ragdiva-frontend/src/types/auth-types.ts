import type { Dispatch, ReactNode, SetStateAction } from "react";

export type AuthDataType = {
    username: string;
    password: string;
};

export type AuthResponseType = {
    message: string;
    data:
        | {
              token: string;
          }
        | [];
};

export type AuthMeType = {
    message: string;
    data: {
        id: string;
        username: string;
        fullName: string;
        level: "admin" | "user" | "asesor";
        majors: {
            id: string;
            userId: string;
            majorId: string;
            majors: {
                id: string;
                majorName: string;
            };
        }[];
    };
};

export type AuthContextType = {
    userInfo: AuthMeType["data"] | null;
    setUserInfo: Dispatch<
        SetStateAction<{
            id: string;
            username: string;
            fullName: string;
            level: "admin" | "user" | "asesor";
            majors: {
                id: string;
                userId: string;
                majorId: string;
                majors: {
                    id: string;
                    majorName: string;
                };
            }[];
        } | null>
    >;
};

export type AuthProviderPropsType = {
    children: ReactNode,
}