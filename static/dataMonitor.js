<!--    数据监控相关埋点和函数 -->
function getMainDomainByDataMonitor() {
  var url = window.location.hostname; // 获取当前主机名
  var parts = url.split("."); // 按点分割
  if (parts.length > 3) {
    // 当主机名有子域时，取最后两个部分
    return parts.slice(-3).join("."); // 返回主域名
  } else if(parts.length > 2){
    return parts.slice(-2).join("."); // 返回主域名
  }
  return url; // 没有子域时直接返回当前主机名
}

function getHostname(){
  var list = window.location.hostname.split('.')
  if(list[0] === 'www'){
    return window.location.hostname.replace('www.','')
  }
  return window.location.hostname.replace('www','')
}

//设置cookie明天过期
function setCookieTomorrow(name, value) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  const expires = "; expires=" + date.toUTCString();
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/; domain=" + getMainDomain(); // 设置cookie
}

function getValueByURLOrCookie(val) {
  let key = 'hi_'+val
  if(val.includes('hi_')){
    key = val
  }
  let buffer = getParam(val) || getCookie(key) || 'unknown'
  //更新到cookie中
  setCookieTomorrow(key,buffer)
  return buffer
}

function getInfoBySource(source) {
  if(source ==='tiktok'){
    let hi_source_clid = getValueByURLOrCookie('ttclid')
    let hi_source_aid = getValueByURLOrCookie('ad_id')
    return{
      hi_source_clid,
      hi_source_aid,
      hi_source_site:'unknown',
      hi_source_site_name:'unknown',
      hi_section_id:'unknown',
      hi_section_name:'unknown',
    }
  } else if(source ==='taboola'){
    let hi_source_clid = getValueByURLOrCookie('tblci')
    let hi_source_aid = getValueByURLOrCookie('campaign_id')
    let hi_source_site = getValueByURLOrCookie('site_id')
    let hi_source_site_name = getValueByURLOrCookie('site_name')
    // let hi_section_id = getValueByURLOrCookie('section_id')
    // let hi_section_name = getValueByURLOrCookie('section_name')
    return{
      hi_source_clid,
      hi_source_aid,
      hi_source_site,
      hi_source_site_name,
      hi_section_id:'unknown',
      hi_section_name:'unknown',
    }
  }else if(source ==='outbrain'){
    let hi_source_clid = getValueByURLOrCookie('dicbo')
    let hi_source_aid = getValueByURLOrCookie('campaign_id')
    let hi_source_site = getValueByURLOrCookie('site_id')
    let hi_source_site_name = getValueByURLOrCookie('site_name')
    let hi_section_id = getValueByURLOrCookie('section_id')
    let hi_section_name = getValueByURLOrCookie('section_name')
    return{
      hi_source_clid,
      hi_source_aid,
      hi_source_site,
      hi_source_site_name,
      hi_section_id,
      hi_section_name,
    }
  }else if(source ==='pinterest'){
    return{
      hi_source_clid:'unknown',
      hi_source_aid:'unknown',
      hi_source_site:'unknown',
      hi_source_site_name:'unknown',
      hi_section_id:'unknown',
      hi_section_name:'unknown',
    }
  }else if(source ==='facebook'){
    let hi_source_clid = getValueByURLOrCookie('fbclid')
    return{
      hi_source_clid,
      hi_source_aid:'unknown',
      hi_source_site:'unknown',
      hi_source_site_name:'unknown',
      hi_section_id:'unknown',
      hi_section_name:'unknown',
    }
  } else {
    return{
      hi_source_clid:'unknown',
      hi_source_aid:'unknown',
      hi_source_site:'unknown',
      hi_source_site_name:'unknown',
      hi_section_id:'unknown',
      hi_section_name:'unknown',
    }
  }
}
//携带参数推送gtm
function pushEventToGTM(event,param={}) {
  const hi_channel = getValueByURLOrCookie('channel')
  const hi_gaid = getCookie('_ga') || 'unknown'
  const hi_source = getValueByURLOrCookie('hi_source')
  const {hi_source_clid,hi_source_aid,hi_source_site} = getInfoBySource(hi_source)
  let buffer = {
    hi_channel,
    hi_gaid,
    hi_source,
    hi_source_clid,
    hi_source_aid,
    hi_source_site
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event,
    ...buffer,
    ...param
  })

}
//两次clid无点击逻辑按子渠道存，点击词条逻辑处理
function TACChangeCookie() {
  const detailPvUser = window.getCookie('detailPvUser')
  try{
    const buffer = JSON.parse(detailPvUser)
    const _isPushGtm =buffer[getHostname()+'_isPushGtm']
    if(_isPushGtm){
      return
    }
    buffer[getHostname()+'_first'] = undefined
    buffer[getHostname()+'_second'] = undefined
    setCookieTomorrow('detailPvUser',JSON.stringify(buffer))

  }catch (e) {}
}

// 数据监控相关
function handleDataMonitor (){
  let T_AR_COUNT = getCookie('T_AR_COUNT')
  const detailPvUser = window.getCookie('detailPvUser')
  let buffer = {}
  const hi_source = getValueByURLOrCookie('hi_source')
  const {hi_source_clid} = getInfoBySource(hi_source)
  try{
    buffer = JSON.parse(detailPvUser)
  }catch (e) {}
  let hi_duration_ms = getCookie('hi_duration_ms')
  let now = new Date().getTime()
  if(!hi_duration_ms){
    hi_duration_ms = 0
  } else {
    hi_duration_ms = now - Number(hi_duration_ms)
    pushEventToGTM('T_AR_MULTI',{
      hi_duration:Math.floor(hi_duration_ms/1000),
      hi_duration_ms
    })
  }
  setCookieTomorrow('hi_duration_ms',now)
  if(T_AR_COUNT !=='yes'){
    T_AR_COUNT =Number(T_AR_COUNT) + 1
    if(T_AR_COUNT === 1){
      pushEventToGTM('T_AR_FIRST',{
        hi_duration:Math.floor((now - Number(buffer[hi_source_clid].time))/1000),
        hi_duration_ms:now - Number(buffer[hi_source_clid].time)
      })
    }else if(T_AR_COUNT>=3){
      pushEventToGTM('T_AR_3')
      setCookieTomorrow('T_AR_COUNT','yes')
      return
    }
    setCookieTomorrow('T_AR_COUNT',T_AR_COUNT)
  }
}

//统计T_AC_MSG 到页面加载之间的时长
function handleTACMSGToLoad(){
  const detail_time = window.getCookie('detail_time')
  let now = new Date().getTime()
    let time = now - Number(detail_time)
    if(!detail_time){
      return 'unknown'
    }
    if(time<=499){
      return '0~499'
    } else if(time > 499 && time<=999){
      return '500~999'
    } else if(time >999) {
      return '>=1000'
    } else {
      return 'unknown'
    }

}

window.addEventListener('beforeunload',()=>{
  if(window.location.pathname.includes('/detail')){
    const detailPvUser = window.getCookie('detailPvUser')
    try{
      const buffer = JSON.parse(detailPvUser)
      const _first = buffer[getHostname()+'_first']
      const _second = buffer[getHostname()+'_second']
      const hi_source = getValueByURLOrCookie('hi_source')
      const {hi_source_clid} = getInfoBySource(hi_source)
      const _isPushGtm =buffer[getHostname()+'_isPushGtm']
      if(_isPushGtm || !_second || window.done2){
        return
      }
      window.done2 = true
      const activeElement = document.activeElement;
      const src = activeElement?.getAttribute("src") || "";
      if(src &&
        src.includes("afs/ads?") &&
        activeElement.getAttribute("id") === "master-1"){
        //第一块词条点击
      } else if(src &&
        src.includes("afs/ads/i/") &&
        activeElement.getAttribute("id") === "slave-1-1"){
        //第二块词条点击
      } else {
        if(_second === hi_source_clid){
          pushEventToGTM('User_second_not_click')
          buffer[getHostname()+'_isPushGtm'] = 1
          setCookieTomorrow('detailPvUser',JSON.stringify(buffer))
        }
      }

    }catch (e) {}
  }
})
