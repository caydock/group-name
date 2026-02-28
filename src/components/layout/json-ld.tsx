export function JsonLd() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "群名岛",
		"alternateName": "Group Name Island",
		"url": "https://qm.caydock.com",
		"description": "群名岛提供海量群聊名称大全，包括搞笑群名、文艺群名、商务群名、家庭群名、校园群名、游戏群名等各种分类",
		"inLanguage": "zh-CN",
		"potentialAction": [
			{
				"@type": "SearchAction",
				"target": "https://qm.caydock.com/search?q={search_term_string}",
				"query-input": "required name=search_term_string"
			},
			{
				"@type": "CreateAction",
				"name": "提交群名",
				"target": "https://qm.caydock.com/submit"
			}
		],
		"about": [
			{
				"@type": "Thing",
				"name": "搞笑群名",
				"description": "各种搞笑幽默的群聊名称，让聊天更有趣"
			},
			{
				"@type": "Thing",
				"name": "文艺群名",
				"description": "文艺范儿的群名，适合喜欢文艺风格的朋友"
			},
			{
				"@type": "Thing",
				"name": "商务群名",
				"description": "专业的商务群名，适合工作和商业用途"
			},
			{
				"@type": "Thing",
				"name": "家庭群名",
				"description": "温馨的家庭群名，适合家人和朋友聊天"
			},
			{
				"@type": "Thing",
				"name": "校园群名",
				"description": "青春活力的校园群名，适合学生和校友"
			},
			{
				"@type": "Thing",
				"name": "游戏群名",
				"description": "游戏相关的群名，适合游戏玩家和战队"
			}
		],
		"sameAs": [
			"https://qm.caydock.com"
		]
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}
