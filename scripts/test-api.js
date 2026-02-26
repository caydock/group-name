// 创建一个简单的测试客户端来访问本地API
async function testAPI() {
  try {
    // 测试分类API
    const categoriesResponse = await fetch('http://localhost:3000/api/categories');
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      console.log('分类数量:', categories.length);
      console.log('分类列表:');
      categories.forEach(cat => console.log(`- ${cat.name}`));
    } else {
      console.log('分类API请求失败:', categoriesResponse.status, categoriesResponse.statusText);
    }

    // 测试合集API
    const collectionsResponse = await fetch('http://localhost:3000/api/collections');
    if (collectionsResponse.ok) {
      const collections = await collectionsResponse.json();
      console.log('\n合集数量:', collections.length);
      console.log('合集列表:');
      collections.forEach(col => console.log(`- ${col.name} (群名数量: ${col.groupNamesCount || 0})`));
    } else {
      console.log('合集API请求失败:', collectionsResponse.status, collectionsResponse.statusText);
    }

    // 测试群名API
    const groupNamesResponse = await fetch('http://localhost:3000/api/group-names');
    if (groupNamesResponse.ok) {
      const data = await groupNamesResponse.json();
      console.log('\n群名数量:', data.total || data.length);
      if (data.groupNames || data.data) {
        const names = data.groupNames || data.data;
        console.log('前5个群名:');
        names.slice(0, 5).forEach(name => {
          console.log(`- ${name.name} (分类: ${name.category?.name || '无'}, 合集: ${name.collection?.name || '无'})`);
        });
      }
    } else {
      console.log('群名API请求失败:', groupNamesResponse.status, groupNamesResponse.statusText);
    }

    // 测试分类筛选API
    const categoryResponse = await fetch('http://localhost:3000/api/group-names?categoryId=2');
    if (categoryResponse.ok) {
      const data = await categoryResponse.json();
      console.log('\n搞笑分类群名数量:', data.total || data.length);
    } else {
      console.log('分类筛选API请求失败:', categoryResponse.status, categoryResponse.statusText);
    }

  } catch (error) {
    console.error('测试API时出错:', error);
  }
}

testAPI();