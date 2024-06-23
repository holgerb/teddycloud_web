import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { List, Switch, Input, Button, Collapse } from "antd";
import { useTranslation } from "react-i18next";
import { TonieCard, TonieCardProps } from "../../components/tonies/TonieCard";
import { TeddyCloudApi } from "../../api";
import { defaultAPIConfig } from "../../config/defaultApiConfig";
import ToniesPagination from "./ToniesPagination";

const { Panel } = Collapse;
const api = new TeddyCloudApi(defaultAPIConfig());
const STORAGE_KEY = "toniesListState";

export const ToniesList: React.FC<{
    tonieCards: TonieCardProps[];
    showFilter: boolean;
    showPagination: boolean;
    overlay: string;
    readOnly: boolean;
}> = ({ tonieCards, showFilter, showPagination, overlay, readOnly }) => {
    const { t } = useTranslation();
    const [filteredTonies, setFilteredTonies] = useState(tonieCards);
    const [searchText, setSearchText] = useState("");
    const [seriesFilter, setSeriesFilter] = useState("");
    const [episodeFilter, setEpisodeFilter] = useState("");
    const [validFilter, setValidFilter] = useState(false);
    const [filterLastTonieboxRUIDs, setFilterLastTonieboxRUIDs] = useState(false);
    const [invalidFilter, setInvalidFilter] = useState(false);
    const [existsFilter, setExistsFilter] = useState(false);
    const [notExistsFilter, setNotExistsFilter] = useState(false);
    const [liveFilter, setLiveFilter] = useState(false);
    const [nocloudFilter, setNocloudFilter] = useState(false);
    const [unsetLiveFilter, setUnsetLiveFilter] = useState(false);
    const [unsetNocloudFilter, setUnsetNocloudFilter] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [loading, setLoading] = useState(true);
    const [lastTonieboxRUIDs, setLastTonieboxRUIDs] = useState<Array<[string, string]>>([]);
    const [pageSize, setPageSize] = useState<number>(() => {
        const storedState = localStorage.getItem(STORAGE_KEY);
        if (storedState) {
            const { pageSize } = JSON.parse(storedState);
            return pageSize;
        }
        return 24;
    });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [paginationEnabled, setPaginationEnabled] = useState(true); // State to track pagination
    const [showAll, setShowAll] = useState(false);
    const [doLocalStore, setLocalStore] = useState(true);

    const location = useLocation();

    useEffect(() => {
        const storedState = localStorage.getItem(STORAGE_KEY);
        if (storedState) {
            try {
                const { pageSize, showAll } = JSON.parse(storedState);
                if (showAll) {
                    handleShowAll();
                } else {
                    setPageSize(pageSize);
                    handlePageSizeChange(1, pageSize);
                }
            } catch (error) {
                console.error("Error parsing stored state:", error);
            }
        } else {
            console.log("No stored state found.");
        }
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tonieRUID = searchParams.get("tonieRUID");
        if (tonieRUID) {
            setSearchText(tonieRUID);
            setCollapsed(false);
            const prefilteredTonies = tonieCards.filter((tonie) => tonie.ruid.toLowerCase() === tonieRUID);
            setFilteredTonies(prefilteredTonies);
        } else {
            setFilteredTonies(tonieCards);
        }
        const fetchTonieboxLastRUID = async (id: string) => {
            const ruid = await api.apiGetTonieboxLastRUID(id);
            return ruid;
        };
        const fetchTonieboxes = async () => {
            const tonieboxData = await api.apiGetTonieboxesIndex();
            const tonieboxLastRUIDs = await Promise.all(
                tonieboxData.map(async (toniebox) => {
                    const lastRUID = await fetchTonieboxLastRUID(toniebox.ID);
                    return [lastRUID, toniebox.boxName] as [string, string];
                })
            );
            setLastTonieboxRUIDs(tonieboxLastRUIDs);
        };
        fetchTonieboxes();
        setLoading(false); // Set loading to false when tonieCards are available
    }, [location.search, tonieCards]);

    useEffect(() => {
        const stateToStore = JSON.stringify({
            pageSize,
            paginationEnabled,
            showAll,
        });
        localStorage.setItem(STORAGE_KEY, stateToStore);
    }, [doLocalStore, pageSize, paginationEnabled, showAll]);

    const storeLocalStorage = () => {
        setLocalStore(!doLocalStore);
    };

    const handleFilter = () => {
        let filtered = tonieCards.filter(
            (tonie) =>
                tonie.tonieInfo.series.toLowerCase().includes(seriesFilter.toLowerCase()) &&
                tonie.tonieInfo.episode.toLowerCase().includes(episodeFilter.toLowerCase()) &&
                (!validFilter || tonie.valid) &&
                (!invalidFilter || !tonie.valid) &&
                (!existsFilter || tonie.exists) &&
                (!notExistsFilter || !tonie.exists) &&
                (!liveFilter || tonie.live) &&
                (!nocloudFilter || tonie.nocloud) &&
                (!unsetLiveFilter || !tonie.live) &&
                (!unsetNocloudFilter || !tonie.nocloud)
        );
        if (searchText) {
            filtered = filtered.filter(
                (tonie) =>
                    tonie.tonieInfo.series.toLowerCase().includes(searchText.toLowerCase()) ||
                    tonie.tonieInfo.episode.toLowerCase().includes(searchText.toLowerCase()) ||
                    tonie.tonieInfo.model.toLowerCase().includes(searchText.toLowerCase()) ||
                    tonie.ruid.toLowerCase().includes(searchText.toLowerCase()) ||
                    tonie.uid.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        if (filterLastTonieboxRUIDs) {
            // Filter by RUID part of the lastTonieboxRUIDs array
            filtered = filtered.filter((tonie) => lastTonieboxRUIDs.some(([ruid]) => ruid === tonie.ruid));
        }
        setFilteredTonies(filtered);
    };

    const handleResetFilters = () => {
        setSearchText("");
        setSeriesFilter("");
        setEpisodeFilter("");
        setValidFilter(false);
        setInvalidFilter(false);
        setExistsFilter(false);
        setNotExistsFilter(false);
        setLiveFilter(false);
        setNocloudFilter(false);
        setUnsetLiveFilter(false);
        setUnsetNocloudFilter(false);
        setFilterLastTonieboxRUIDs(false);
        const urlWithoutParams = window.location.pathname;
        window.history.pushState({}, "", urlWithoutParams);
        location.search = "";
        setFilteredTonies(tonieCards);
    };

    const handleShowAll = () => {
        setShowAll(true);
        setPaginationEnabled(false);
        storeLocalStorage();
    };

    const handleShowPagination = () => {
        setPaginationEnabled(true);
        setShowAll(false);
        handlePageSizeChange(1, pageSize);
    };

    const handlePageSizeChange = (current: number, size: number) => {
        setPageSize(size as number);
        setCurrentPage(current);
        storeLocalStorage();
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    const getCurrentPageData = () => {
        if (showAll) {
            return filteredTonies !== null ? filteredTonies : tonieCards;
        } else {
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            return filteredTonies !== null
                ? filteredTonies.slice(startIndex, endIndex)
                : tonieCards.slice(startIndex, endIndex);
        }
    };

    const listPagination = (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {!paginationEnabled ? (
                <Button onClick={handleShowPagination}>{t("tonies.tonies.showPagination")}</Button>
            ) : (
                <ToniesPagination
                    currentPage={currentPage}
                    onChange={handlePageSizeChange}
                    total={filteredTonies !== null ? filteredTonies.length : tonieCards.length}
                    pageSize={pageSize}
                    additionalButtonOnClick={handleShowAll}
                />
            )}
        </div>
    );

    return (
        <div className="tonies-list-container">
            {showFilter ? (
                <Collapse
                    defaultActiveKey={collapsed ? [] : ["search-filter"]}
                    onChange={() => setCollapsed(!collapsed)}
                    bordered={false}
                >
                    <Panel
                        header={
                            collapsed
                                ? t("tonies.tonies.filterBar.showFilters")
                                : t("tonies.tonies.filterBar.hideFilters")
                        }
                        key="search-filter"
                    >
                        <label htmlFor="search-field" className="filter-label">
                            {t("tonies.tonies.filterBar.searchLabel")}
                        </label>
                        <Input.Search
                            id="search-field"
                            placeholder={t("tonies.tonies.filterBar.searchPlaceholder")}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onSearch={handleFilter}
                            enterButton
                            style={{ margin: "8px 0 8px 0" }}
                        />
                        <div className="filter-container">
                            <label className="filter-label">{t("tonies.tonies.filterBar.filterLabel")}</label>
                            <Input
                                style={{ margin: "8px 0 8px 0" }}
                                placeholder={t("tonies.tonies.filterBar.seriesFilterPlaceholder")}
                                value={seriesFilter}
                                onChange={(e) => setSeriesFilter(e.target.value)}
                            />
                            <Input
                                style={{ margin: "8px 0 8px 0" }}
                                placeholder={t("tonies.tonies.filterBar.episodeFilterPlaceholder")}
                                value={episodeFilter}
                                onChange={(e) => setEpisodeFilter(e.target.value)}
                            />
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <div
                                        style={{
                                            flexWrap: "nowrap",
                                            marginRight: 16,
                                        }}
                                    >
                                        <Switch
                                            checked={validFilter}
                                            onChange={(checked) => setValidFilter(checked)}
                                            style={{ margin: "8px 0 8px 0" }}
                                        />{" "}
                                        {t("tonies.tonies.filterBar.valid")}
                                    </div>
                                    <div
                                        style={{
                                            flexWrap: "nowrap",
                                            marginRight: 16,
                                        }}
                                    >
                                        <Switch
                                            checked={invalidFilter}
                                            onChange={(checked) => setInvalidFilter(checked)}
                                            style={{ margin: "8px 0 8px 0" }}
                                        />{" "}
                                        {t("tonies.tonies.filterBar.invalid")}
                                    </div>
                                    <div
                                        style={{
                                            flexWrap: "nowrap",
                                            marginRight: 16,
                                        }}
                                    >
                                        <Switch
                                            checked={existsFilter}
                                            onChange={(checked) => setExistsFilter(checked)}
                                            style={{ margin: "8px 0 8px 0" }}
                                        />{" "}
                                        {t("tonies.tonies.filterBar.exists")}
                                    </div>
                                    <div
                                        style={{
                                            flexWrap: "nowrap",
                                            marginRight: 16,
                                        }}
                                    >
                                        <Switch
                                            checked={notExistsFilter}
                                            onChange={(checked) => setNotExistsFilter(checked)}
                                            style={{ margin: "8px 0 8px 0" }}
                                        />{" "}
                                        {t("tonies.tonies.filterBar.notExists")}
                                    </div>
                                    <div
                                        style={{
                                            flexWrap: "nowrap",
                                            marginRight: 16,
                                        }}
                                    >
                                        <Switch
                                            checked={liveFilter}
                                            onChange={(checked) => setLiveFilter(checked)}
                                            style={{ margin: "8px 0 8px 0" }}
                                        />{" "}
                                        {t("tonies.tonies.filterBar.live")}
                                    </div>
                                    <div
                                        style={{
                                            flexWrap: "nowrap",
                                            marginRight: 16,
                                        }}
                                    >
                                        <Switch
                                            checked={unsetLiveFilter}
                                            onChange={(checked) => setUnsetLiveFilter(checked)}
                                            style={{ margin: "8px 0 8px 0" }}
                                        />{" "}
                                        {t("tonies.tonies.filterBar.unsetLive")}
                                    </div>
                                    <div
                                        style={{
                                            flexWrap: "nowrap",
                                            marginRight: 16,
                                        }}
                                    >
                                        <Switch
                                            checked={nocloudFilter}
                                            onChange={(checked) => setNocloudFilter(checked)}
                                            style={{ margin: "8px 0 8px 0" }}
                                        />{" "}
                                        {t("tonies.tonies.filterBar.noCloud")}
                                    </div>
                                    <div
                                        style={{
                                            flexWrap: "nowrap",
                                            marginRight: 16,
                                        }}
                                    >
                                        <Switch
                                            checked={unsetNocloudFilter}
                                            onChange={(checked) => setUnsetNocloudFilter(checked)}
                                            style={{ margin: "8px 0 8px 0" }}
                                        />{" "}
                                        {t("tonies.tonies.filterBar.unsetNoCloud")}
                                    </div>
                                    <div
                                        style={{
                                            flexWrap: "nowrap",
                                            marginRight: 16,
                                        }}
                                    >
                                        <Switch
                                            checked={filterLastTonieboxRUIDs}
                                            onChange={(checked) => setFilterLastTonieboxRUIDs(checked)}
                                            style={{ margin: "8px 0 8px 0" }}
                                        />{" "}
                                        {t("tonies.tonies.filterBar.lastPlayed")}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Button onClick={handleResetFilters} style={{ marginLeft: 16 }}>
                                        {t("tonies.tonies.filterBar.resetFilters")}
                                    </Button>
                                    <Button onClick={handleFilter} style={{ marginLeft: 16 }}>
                                        {t("tonies.tonies.filterBar.applyFilters")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            ) : (
                ""
            )}
            <List
                header={showPagination ? listPagination : ""}
                footer={showPagination ? listPagination : ""}
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 3,
                    xl: 4,
                    xxl: 6,
                }}
                dataSource={getCurrentPageData()}
                renderItem={(tonie) => (
                    <List.Item id={tonie.ruid}>
                        <TonieCard
                            tonieCard={tonie}
                            lastRUIDs={lastTonieboxRUIDs}
                            overlay={overlay}
                            readOnly={readOnly}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};
