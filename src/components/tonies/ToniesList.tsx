import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { List, Switch, Input, Button, Collapse } from 'antd';
import { useTranslation } from 'react-i18next';
import { TonieCard, TonieCardProps } from '../../components/tonies/TonieCard';
import { TeddyCloudApi } from '../../api';
import { defaultAPIConfig } from '../../config/defaultApiConfig';

const { Panel } = Collapse;
const api = new TeddyCloudApi(defaultAPIConfig());

export const ToniesList: React.FC<{ tonieCards: TonieCardProps[], showFilter: boolean }> = ({ tonieCards, showFilter }) => {
    const { t } = useTranslation();
    const [filteredTonies, setFilteredTonies] = useState(tonieCards);
    const [searchText, setSearchText] = useState('');
    const [seriesFilter, setSeriesFilter] = useState('');
    const [episodeFilter, setEpisodeFilter] = useState('');
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

    const location = useLocation();

    useEffect(() => {

        const searchParams = new URLSearchParams(location.search);
        const tonieRUID = searchParams.get('tonieRUID');
        if (tonieRUID) {
            setSearchText(tonieRUID);
            setCollapsed(false)
            const prefilteredTonies = tonieCards.filter(tonie => tonie.ruid.toLowerCase() === tonieRUID);
            setFilteredTonies(prefilteredTonies);
        } else {
            setCollapsed(true);
            setFilteredTonies(tonieCards);
        }
        const fetchTonieboxLastRUID = async (id: string) => {
            const ruid = await api.apiGetTonieboxLastRUID(id);
            return ruid;
        };
        const fetchTonieboxes = async () => {
            const tonieboxData = await api.apiGetTonieboxesIndex();
            const tonieboxLastRUIDs = await Promise.all(
                tonieboxData.map(async toniebox => {
                    const lastRUID = await fetchTonieboxLastRUID(toniebox.ID);
                    return [lastRUID, toniebox.boxName] as [string, string];
                })
            );
            setLastTonieboxRUIDs(tonieboxLastRUIDs);
        };
        fetchTonieboxes();
        setLoading(false); // Set loading to false when tonieCards are available
    }, [location.search, tonieCards]);

    const handleFilter = () => {
        let filtered = tonieCards.filter(tonie =>
            tonie.tonieInfo.series.toLowerCase().includes(seriesFilter.toLowerCase())
            && tonie.tonieInfo.episode.toLowerCase().includes(episodeFilter.toLowerCase())
            && (!validFilter || tonie.valid)
            && (!invalidFilter || !tonie.valid)
            && (!existsFilter || tonie.exists)
            && (!notExistsFilter || !tonie.exists)
            && (!liveFilter || tonie.live)
            && (!nocloudFilter || tonie.nocloud)
            && (!unsetLiveFilter || !tonie.live)
            && (!unsetNocloudFilter || !tonie.nocloud)
        );
        if (searchText) {
            filtered = filtered.filter(tonie =>
                tonie.tonieInfo.series.toLowerCase().includes(searchText.toLowerCase())
                || tonie.tonieInfo.episode.toLowerCase().includes(searchText.toLowerCase())
                || tonie.tonieInfo.model.toLowerCase().includes(searchText.toLowerCase())
                || tonie.ruid.toLowerCase().includes(searchText.toLowerCase())
                || tonie.uid.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        if (filterLastTonieboxRUIDs) {
            // Filter by RUID part of the lastTonieboxRUIDs array
            filtered = filtered.filter(tonie =>
                lastTonieboxRUIDs.some(([ruid]) => ruid === tonie.ruid)
            );
        }
        setFilteredTonies(filtered);
    };

    const handleResetFilters = () => {
        setSearchText('');
        setSeriesFilter('');
        setEpisodeFilter('');
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
        window.history.pushState({}, '', urlWithoutParams);
        setFilteredTonies(tonieCards);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="tonies-list-container">
            {showFilter ? (
                <Collapse
                    defaultActiveKey={collapsed ? [] : ['search-filter']}
                    onChange={() => setCollapsed(!collapsed)}
                    bordered={false}
                >
                    <Panel header={collapsed ? t('tonies.tonies.filterBar.showFilters') : t('tonies.tonies.filterBar.hideFilters')} key="search-filter">

                        <label htmlFor="search-field" className="filter-label">{t('tonies.tonies.filterBar.searchLabel')}</label>
                        <Input.Search
                            id="search-field"
                            placeholder={t('tonies.tonies.filterBar.searchPlaceholder')}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onSearch={handleFilter}
                            enterButton
                            style={{ margin: "8px 0 8px 0" }}

                        />
                        <div className="filter-container">
                            <label className="filter-label">{t('tonies.tonies.filterBar.filterLabel')}</label>
                            <Input
                                style={{ margin: "8px 0 8px 0" }}
                                placeholder={t('tonies.tonies.filterBar.seriesFilterPlaceholder')}
                                value={seriesFilter}
                                onChange={(e) => setSeriesFilter(e.target.value)}
                            />
                            <Input
                                style={{ margin: "8px 0 8px 0" }}
                                placeholder={t('tonies.tonies.filterBar.episodeFilterPlaceholder')}
                                value={episodeFilter}
                                onChange={(e) => setEpisodeFilter(e.target.value)}
                            />
                            <div>
                                <div style={{ display: "flex", flexWrap: "wrap" }}>
                                    <div style={{ flexWrap: "nowrap", marginRight: 16 }}><Switch checked={validFilter} onChange={(checked) => setValidFilter(checked)} style={{ margin: "8px 0 8px 0" }} /> {t("tonies.tonies.filterBar.valid")}</div>
                                    <div style={{ flexWrap: "nowrap", marginRight: 16 }}><Switch checked={invalidFilter} onChange={(checked) => setInvalidFilter(checked)} style={{ margin: "8px 0 8px 0" }} /> {t("tonies.tonies.filterBar.invalid")}</div>
                                    <div style={{ flexWrap: "nowrap", marginRight: 16 }}><Switch checked={existsFilter} onChange={(checked) => setExistsFilter(checked)} style={{ margin: "8px 0 8px 0" }} /> {t("tonies.tonies.filterBar.exists")}</div>
                                    <div style={{ flexWrap: "nowrap", marginRight: 16 }}><Switch checked={notExistsFilter} onChange={(checked) => setNotExistsFilter(checked)} style={{ margin: "8px 0 8px 0" }} /> {t("tonies.tonies.filterBar.notExists")}</div>
                                    <div style={{ flexWrap: "nowrap", marginRight: 16 }}><Switch checked={liveFilter} onChange={(checked) => setLiveFilter(checked)} style={{ margin: "8px 0 8px 0" }} /> {t("tonies.tonies.filterBar.live")}</div>
                                    <div style={{ flexWrap: "nowrap", marginRight: 16 }}><Switch checked={unsetLiveFilter} onChange={(checked) => setUnsetLiveFilter(checked)} style={{ margin: "8px 0 8px 0" }} /> {t("tonies.tonies.filterBar.unsetLive")}</div>
                                    <div style={{ flexWrap: "nowrap", marginRight: 16 }}><Switch checked={nocloudFilter} onChange={(checked) => setNocloudFilter(checked)} style={{ margin: "8px 0 8px 0" }} /> {t("tonies.tonies.filterBar.noCloud")}</div>
                                    <div style={{ flexWrap: "nowrap", marginRight: 16 }}><Switch checked={unsetNocloudFilter} onChange={(checked) => setUnsetNocloudFilter(checked)} style={{ margin: "8px 0 8px 0" }} /> {t("tonies.tonies.filterBar.unsetNoCloud")}</div>
                                    <div style={{ flexWrap: "nowrap", marginRight: 16 }}><Switch checked={filterLastTonieboxRUIDs} onChange={(checked) => setFilterLastTonieboxRUIDs(checked)} style={{ margin: "8px 0 8px 0" }} /> {t("tonies.tonies.filterBar.lastPlayed")}</div>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end" }}>
                                    <Button onClick={handleResetFilters} style={{ marginLeft: 16 }}>{t('tonies.tonies.filterBar.resetFilters')}</Button>
                                    <Button onClick={handleFilter} style={{ marginLeft: 16 }}>{t('tonies.tonies.filterBar.applyFilters')}</Button>
                                </div>
                            </div>
                        </div></Panel>
                </Collapse>) : ""}
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 3,
                    xl: 4,
                    xxl: 6
                }}
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 24,
                    pageSizeOptions: ["24", "48", "96", "192"],
                    position: "both",
                    style: { marginBottom: "16px" },
                    locale: {
                        items_per_page: t('tonies.tonies.pageSelector'),
                    }
                }}
                rowKey="uid"
            dataSource={filteredTonies}
                renderItem={(tonie) => (
                    <List.Item id={tonie.ruid}>
                        <TonieCard tonieCard={tonie} lastRUIDs={lastTonieboxRUIDs} />
                    </List.Item>
                )}
            />
        </div>
    );
};