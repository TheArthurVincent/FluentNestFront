import React, { useCallback, useEffect, useState } from "react";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";
import { useParams } from "react-router-dom";
import { backDomain, updateInfo } from "../../Resources/UniversalComponents";
import axios from "axios";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { newArvinTitleStyle } from "../ArvinComponents/NewHomePageArvin/NewHomePageArvin";
import HomeworkRenderer from "./HomeworkComponents/HomeworkRenderer";

interface AllPendingHomeworkAssignmentsProps {
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
  groupclass: {
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
  };
};

export default function AllPendingHomeworkAssignments({
  headers,
  setChange,
  change,
  isDesktop,
}: AllPendingHomeworkAssignmentsProps) {
  const { studentId } = useParams<{ studentId: string }>();
  const { UniversalTexts } = useUserContext();

  const actualHeaders = headers || {};
  const LIMIT = 10;

  const [tutoringList, setTutoringList] = useState<any[]>([]);
  const [groupClassList, setGroupClassList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [ID, setID] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [myPermissions, setPermissions] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: LIMIT,
    tutoring: { total: 0, totalPages: 1, hasNextPage: false },
    groupclass: { total: 0, totalPages: 1, hasNextPage: false },
  });

  const isAllowed =
    myPermissions === "superadmin" || myPermissions === "teacher";

  const fetchHWPendingAll = useCallback(
    async (loggedId: string, pageToFetch: number, append = false) => {
      if (!loggedId) return;

      if (pageToFetch === 1 && !append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await axios.get(
          `${backDomain}/api/v1/homework-pending-all/${loggedId}?page=${pageToFetch}&limit=${LIMIT}`,
          { headers: actualHeaders },
        );

        const newTutoringList = response.data.tutoringHomeworkList || [];
        const newGroupClassList = response.data.groupClassHomeworkList || [];
        const newPagination = response.data.pagination || {
          page: pageToFetch,
          limit: LIMIT,
          tutoring: { total: 0, totalPages: 1, hasNextPage: false },
          groupclass: { total: 0, totalPages: 1, hasNextPage: false },
        };

        setTutoringList((prev) => {
          if (!append) return newTutoringList;

          const existingIds = new Set(prev.map((item) => String(item._id)));
          const filteredNewItems = newTutoringList.filter(
            (item: any) => !existingIds.has(String(item._id)),
          );

          return [...prev, ...filteredNewItems];
        });

        if (!append) {
          setGroupClassList(newGroupClassList);
        }

        setStudentName(response.data.studentName || "");
        setPagination(newPagination);
        setHasNextPage(Boolean(newPagination?.tutoring?.hasNextPage));
      } catch (error) {
        console.log(error, "erro ao listar homework pendentes (all)");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [actualHeaders],
  );

  const resetAndReload = async () => {
    if (!ID) return;

    setPage(1);
    setTutoringList([]);
    setGroupClassList([]);
    await fetchHWPendingAll(ID, 1, false);
  };

  useEffect(() => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const { id, permissions } = getLoggedUser;

    setID(id);
    updateInfo(id, actualHeaders);
    setPermissions(permissions);
  }, [actualHeaders]);

  useEffect(() => {
    if (!ID) return;

    setPage(1);
    setTutoringList([]);
    setGroupClassList([]);
    fetchHWPendingAll(ID, 1, false);
  }, [ID, change, fetchHWPendingAll]);

  useEffect(() => {
    if (!ID || page === 1) return;
    fetchHWPendingAll(ID, page, true);
  }, [ID, page, fetchHWPendingAll]);

  return (
    <div style={{ margin: !isDesktop ? "0px" : "0px 16px 0px 0px" }}>
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
              Homeworks pendentes (todos os alunos) — {studentName}
            </span>
          </section>
        </div>
      )}

      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          width: "95%",
          border: "1px solid #e8eaed",
          padding: "10px",
        }}
      >
        <Helmets text={`Homeworks pendentes - ${studentName}`} />

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
              {pagination?.tutoring?.total || 0} tutoring •{" "}
              {pagination?.groupclass?.total || 0} groupclass
            </span>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <HomeworkRenderer
            headers={actualHeaders as MyHeadersType}
            homeworks={tutoringList}
            studentId={studentId}
            loggedId={ID}
            isDesktop={isDesktop}
            isAllowed={isAllowed}
            disabled={disabled}
            setDisabled={setDisabled}
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
            showStudentName={true}
            mode="all"
          />
        </div>
      </div>
    </div>
  );
}