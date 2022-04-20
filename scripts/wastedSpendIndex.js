// Motley Fool Wasted Spend Auditor
// doug@withseismic.com

// Wrote this forever ago to audit account wasted spend at scale. This account was like, thousands of campaigns deep 
// HOW TO: Run script and look at Logs section.

// Traffic Eff: How well your account is sculpting search terms and binning non-converting terms.
// Cost Eff: How wasteful your spend it.
// Waste Score: Blend of the two.

//  0 is bad, 100 is perfect
// Use this to determine whether you're wasting money or not.


function main() {
    const report = AdsApp.report(
      'SELECT Query,Clicks,Cost,Conversions,CampaignId,AdGroupId ' +
        ' FROM SEARCH_QUERY_PERFORMANCE_REPORT ' +
        ' DURING LAST_MONTH'
    )
  
    let searchTermStats = [ { Clicks: 0, Cost: 0 }, { Clicks: 0, Cost: 0 } ]
    
    let rows = report.rows()
    while (rows.hasNext()) {
        let searchTerm = rows.next()
  
        let bucket = searchTerm.Conversions > 1 ? 1 : 0
  
      searchTermStats[bucket].Clicks += parseInt(searchTerm.Clicks)
      searchTermStats[bucket].Cost += parseInt(searchTerm.Cost)
    }
  
    let trafficEff = searchTermStats[0].Clicks / searchTermStats[1].Clicks // Ratio: Search terms clicks that converted versus search term clicks that didnt. 1 is best.
    let costEff = searchTermStats[0].Cost / searchTermStats[1].Cost // Ratio : Amount of spend for conversions versus amount of spend without conversion. 1 is best.
    let foolIndex = 5 * trafficEff + 5 * costEff
  
    Logger.log('Traffic Efficiency: %s/100 - Cost Efficiency: %s/100 - Score: %s/100', trafficEff.toFixed(3)*100, costEff.toFixed(3)*100, foolIndex.toFixed(3)*10)
  }
  