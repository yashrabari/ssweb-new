import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { Back, Container, Page, Row, Title } from "../../components/common";
import { Plan, Switch, SwitchButton } from "../../components/Subscriptions";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useGetSubscriptionsAndPackagesQuery } from "../../store/slice/api";
import { useSelector } from "react-redux";
import useWindowSize from "../../utils/hook/useWindowSize";

export default function Subscriptions() {
  const [monthly, setMonthly] = useState(true);
  const [interval, setInterval] = useState("month");
  const user = useSelector((state) => state.reducer.auth.user);

  const {
    data: subscriptionsAndPackagesApiResponse,
    isLoading: isFetchingSubscriptionsAndPackages,
    error: errorFetchingSubscriptionsAndPackages,
  } = useGetSubscriptionsAndPackagesQuery();

  const packages = useMemo(() => {
    if (!subscriptionsAndPackagesApiResponse) return [];

    return subscriptionsAndPackagesApiResponse.data
      .filter(
        (snp) =>
          snp.nickname.includes("package:") &&
          (monthly
            ? snp.recurring.interval === "month"
            : snp.recurring.interval === "year")
      )
      .map((snp) => ({
        ...snp,
        nickname: snp.nickname.split(":")[1],
        currency: snp.currency === "usd" ? "$" : "$",
        order: snp.nickname.includes("BASIC")
          ? 1
          : snp.nickname.includes("STANDARD")
          ? 2
          : 3,
        color: snp.nickname.includes("BASIC")
          ? "#FBBC05"
          : snp.nickname.includes("STANDARD")
          ? "#A7D170"
          : "#F19ECE",
        availableFeatureCount: snp.nickname.includes("BASIC")
          ? 2
          : snp.nickname.includes("STANDARD")
          ? 3
          : 4,
      }))
      .sort((a, b) => a.order - b.order);
  }, [subscriptionsAndPackagesApiResponse, interval, monthly]);

  const storages = useMemo(() => {
    if (!subscriptionsAndPackagesApiResponse) return [];

    return subscriptionsAndPackagesApiResponse.data
      .filter(
        (snp) =>
          snp.nickname.includes("storage:") &&
          (monthly
            ? snp.recurring.interval === "month"
            : snp.recurring.interval === "year")
      )
      .map((snp) => ({
        ...snp,
        nickname: snp.nickname.split(":")[1],
        currency: snp.currency === "usd" ? "$" : "$",
        order: parseInt(snp.nickname.split(":")[1]),
      }))
      .sort((a, b) => a.order - b.order);
  }, [subscriptionsAndPackagesApiResponse, interval, monthly]);

  const videos = useMemo(() => {
    if (!subscriptionsAndPackagesApiResponse) return [];

    return subscriptionsAndPackagesApiResponse.data
      .filter(
        (snp) =>
          snp.nickname.includes("videos:") &&
          (monthly
            ? snp.recurring.interval === "month"
            : snp.recurring.interval === "year")
      )
      .map((snp) => ({
        ...snp,
        nickname: snp.nickname.split(":")[1],
        currency: snp.currency === "usd" ? "$" : "$",
        order: parseInt(snp.nickname.split(":")[1]),
      }))
      .sort((a, b) => a.order - b.order);
  }, [subscriptionsAndPackagesApiResponse, interval, monthly]);

  useEffect(() => {
    if (user && user.subscription) {
      user.subscription.items.find((items) => {
        if (items.plan.nickname.includes("package")) {
          if (items.plan.interval === "month") {
            setMonthly(true);
          } else {
            setMonthly(false);
          }
        }
      });
    }
  }, [user]);

  const { width } = useWindowSize();

  return (
    <Page justifyContent="flex-start">
      <Container
        width="80%"
        margin="29px auto"
        style={{
          padding: width < 1150 && "0px 70px",
          flexDirection: width < 1150 && "column",
        }}
        justifyContent="flex-start"
      >
        <Title fontWeight="700" margin="46px auto">
          Subscription & Packages
        </Title>
        {isFetchingSubscriptionsAndPackages ? (
          <LoadingSpinner />
        ) : errorFetchingSubscriptionsAndPackages ? (
          <></>
        ) : (
          <>
            <Switch>
              <SwitchButton
                active={monthly}
                onClick={() => {
                  setMonthly(true);
                  setInterval("month");
                }}
              >
                <p style={{ margin: "auto" }}>Monthly</p>
              </SwitchButton>
              <SwitchButton
                right
                active={!monthly}
                onClick={() => {
                  setMonthly(false);
                  setInterval("year");
                }}
              >
                <p style={{ margin: "auto" }}>Yearly</p>
              </SwitchButton>
            </Switch>

            <Row
              justifyContent="space-between"
              style={{ flexDirection: width < 1000 && "column" }}
            >
              {packages.map((plan, index) => (
                <Plan
                  key={index}
                  plan={plan}
                  videos={videos}
                  storages={storages}
                  interval={interval}
                  monthly={monthly}
                />
              ))}
            </Row>
          </>
        )}
        <Back />
      </Container>
    </Page>
  );
}
