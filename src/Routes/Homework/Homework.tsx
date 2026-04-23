import React, { useCallback, useEffect, useState } from "react";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";
import { useParams } from "react-router-dom";
import { backDomain, updateInfo } from "../../Resources/UniversalComponents";
import axios from "axios";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { partnerColor } from "../../Styles/Styles";
import { newArvinTitleStyle } from "../ArvinComponents/NewHomePageArvin/NewHomePageArvin";
import NewHomeworkModal from "../ArvinComponents/Students/TheStudent/sections/StudentsRecurringTutorings/NewHomework/NewHomework";
import HomeworkRenderer from "./HomeworkComponents/HomeworkRenderer";

interface HWProps {
  headers: MyHeadersType | null;
  setChange: any;
  change: boolean;
  isDesktop: boolean;
}

type PaginationState = {
  page: number;
  limit: number;
  tutoring: {
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
  };
};

export default function Homework({
  headers,
  setChange,
  change,
  isDesktop,
}: HWProps) {
  const { studentId } = useParams<{ studentId: string }>();
  const { UniversalTexts } = useUserContext();

  const actualHeaders = headers || {};
  const LIMIT = 10;

  const [tutoringList, setTutoringList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const [ID, setID] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [myPermissions, setPermissions] = useState<string>("");

  const [studentName, setStudentName] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: LIMIT,
    tutoring: {
      total: 0,
      totalPages: 1,
      hasNextPage: false,
    },
  });
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const isAllowed =
    myPermissions === "superadmin" || myPermissions === "teacher";

  const mainEventIdForNewHomework =
    tutoringList[0]?.eventDetails?.id || tutoringList[0]?.eventID || "";

  const fetchHW = useCallback(
    async (
      targetStudentId: string,
      pageToFetch = 1,
      append = false,
      forceMainLoading = false,
    ) => {
      if (!targetStudentId) return;

      if (forceMainLoading || (!append && pageToFetch === 1)) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await axios.get(
          `${backDomain}/api/v1/homework/${targetStudentId}?page=${pageToFetch}&limit=${LIMIT}`,
          {
            headers: actualHeaders,
          },
        );

        const newTutoringList = response.data.tutoringHomeworkList || [];
        const newPagination = response.data.pagination || {
          page: pageToFetch,
          limit: LIMIT,
          tutoring: {
            total: newTutoringList.length,
            totalPages: 1,
            hasNextPage: false,
          },
        };

        setTutoringList((prev) => {
          if (!append) return newTutoringList;

          const existingIds = new Set(prev.map((item) => String(item._id)));
          const filteredNewItems = newTutoringList.filter(
            (item: any) => !existingIds.has(String(item._id)),
          );

          return [...prev, ...filteredNewItems];
        });

        setStudentName(response.data.studentName || "");
        setPagination(newPagination);
        setHasNextPage(Boolean(newPagination?.tutoring?.hasNextPage));
      } catch (error) {
        console.log(error, "erro ao listar homework");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [actualHeaders],
  );

  const resetAndReload = async () => {
    const targetId = studentId || ID;
    if (!targetId) return;

    setPage(1);
    setTutoringList([]);
    await fetchHW(targetId, 1, false, true);
  };

  useEffect(() => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const { id, permissions } = getLoggedUser;

    setID(id);
    updateInfo(id, actualHeaders);
    setPermissions(permissions);
  }, [actualHeaders]);

  useEffect(() => {
    const targetId = studentId || ID;
    if (!targetId) return;

    setPage(1);
    setTutoringList([]);
    fetchHW(targetId, 1, false, true);
  }, [ID, studentId, change, fetchHW]);

  useEffect(() => {
    const targetId = studentId || ID;
    if (!targetId || page === 1) return;

    fetchHW(targetId, page, true, false);
  }, [page, studentId, ID, fetchHW]);

  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
            paddingBottom: 17,
            display: "flex",
            alignItems: "center",
          }}
        >
          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "8px",
              width: "100%",
              fontSize: "1.5rem",
            }}
          >
            <span style={newArvinTitleStyle}>
              Lições de Casa de {studentName}
            </span>
          </section>
        </div>
      )}

      <div
        style={{
          fontFamily: "Lato",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          margin: "10px auto",
          width: "95%",
          border: "1px solid #e8eaed",
          padding: "10px",
        }}
      >
        {isAllowed && (
          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <a
              href={`/students/${studentId}`}
              style={{
                fontWeight: 700,
                textAlign: "right",
                color: partnerColor(),
                textDecoration: "none",
                fontSize: 12,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Ver aluno
              <i
                style={{
                  marginLeft: 4,
                }}
                className="fa fa-chevron-right"
              />
            </a>

            <NewHomeworkModal
              headers={actualHeaders}
              studentID={studentId || ID}
              eventID={mainEventIdForNewHomework || ""}
              buttonLabel="+ Novo Homework"
              onHomeworkCreated={(newHomeworks) => {
                setTutoringList((prev) => [...newHomeworks, ...prev]);
              }}
            />
          </div>
        )}

        <Helmets text={`Lições da Casa de ${studentName}`} />

        {!loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginTop: 10,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
              {pagination?.tutoring?.total || tutoringList.length} homeworks
            </span>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <HomeworkRenderer
            headers={actualHeaders as MyHeadersType}
            homeworks={tutoringList}
            isDesktop={isDesktop}
            isAllowed={isAllowed}
            studentId={studentId || ID}
            disabled={disabled}
            hasNextPage={hasNextPage}
            loading={loading}
            loadingMore={loadingMore}
            UniversalTexts={UniversalTexts}
            onReload={resetAndReload}
            onLoadMore={() => {
              if (hasNextPage && !loadingMore) {
                setPage((prev) => prev + 1);
              }
            }}
            onChangeStatus={() => setChange(!change)}
            setDisabled={setDisabled}
          />
        </div>
      </div>
    </div>
  );
}