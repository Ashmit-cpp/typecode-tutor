export const algorithms = {
    "1. Binary Search": `function binarySearch(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1;
  
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
  
      if (arr[mid] === target) return mid;
      if (arr[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
  
    return -1;
  }`,
    
    "2. Two Pointers Technique": `function hasTwoSum(arr: number[], target: number): boolean {
    let left = 0, right = arr.length - 1;
  
    while (left < right) {
      const sum = arr[left] + arr[right];
      if (sum === target) return true;
      if (sum < target) left++;
      else right--;
    }
  
    return false;
  }`,
    
    "3. Sliding Window": `function maxSubarraySum(nums: number[], k: number): number {
    let maxSum = 0, currentSum = 0;
  
    for (let i = 0; i < k; i++) currentSum += nums[i];
    maxSum = currentSum;
  
    for (let i = k; i < nums.length; i++) {
      currentSum += nums[i] - nums[i - k];
      maxSum = Math.max(maxSum, currentSum);
    }
  
    return maxSum;
  }`,
    
    "4. Depth-First Search (DFS)": `function dfs(graph: Map<number, number[]>, node: number, visited = new Set<number>()) {
    if (visited.has(node)) return;
    visited.add(node);
  
    for (const neighbor of graph.get(node) || []) {
      dfs(graph, neighbor, visited);
    }
  }`,
    
    "5. Breadth-First Search (BFS)": `function bfs(graph: Map<number, number[]>, start: number) {
    const visited = new Set<number>();
    const queue: number[] = [start];
  
    while (queue.length) {
      const node = queue.shift()!;
      if (visited.has(node)) continue;
      visited.add(node);
  
      for (const neighbor of graph.get(node) || []) {
        if (!visited.has(neighbor)) queue.push(neighbor);
      }
    }
  }`,
    
    "6. Merge Sort": `function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
  
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
  
    return merge(left, right);
  }
  
  function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
  
    while (i < left.length && j < right.length) {
      result.push(left[i] < right[j] ? left[i++] : right[j++]);
    }
  
    return result.concat(left.slice(i)).concat(right.slice(j));
  }`,
    
    "7. Dijkstra's Algorithm": `type Edge = [number, number]; // [neighbor, weight]
  
  function dijkstra(graph: Map<number, Edge[]>, start: number): Map<number, number> {
    const dist = new Map<number, number>();
    const visited = new Set<number>();
    const pq: [number, number][] = [[0, start]]; // [distance, node]
  
    graph.forEach((_, node) => dist.set(node, Infinity));
    dist.set(start, 0);
  
    while (pq.length) {
      pq.sort(([a], [b]) => a - b);
      const [d, node] = pq.shift()!;
      if (visited.has(node)) continue;
      visited.add(node);
  
      for (const [neighbor, weight] of graph.get(node) || []) {
        const newDist = d + weight;
        if (newDist < (dist.get(neighbor) || Infinity)) {
          dist.set(neighbor, newDist);
          pq.push([newDist, neighbor]);
        }
      }
    }
  
    return dist;
  }`,
    
    "8. Union-Find (Disjoint Set Union)": `class UnionFind {
    parent: number[];
  
    constructor(size: number) {
      this.parent = Array.from({ length: size }, (_, i) => i);
    }
  
    find(x: number): number {
      if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]); // Path compression
      }
      return this.parent[x];
    }
  
    union(x: number, y: number): void {
      const rootX = this.find(x);
      const rootY = this.find(y);
      if (rootX !== rootY) this.parent[rootY] = rootX;
    }
  
    connected(x: number, y: number): boolean {
      return this.find(x) === this.find(y);
    }
  }`,
    
    "9. Kadane's Algorithm": `function maxSubArray(nums: number[]): number {
    let maxSoFar = nums[0];
    let currentMax = nums[0];
  
    for (let i = 1; i < nums.length; i++) {
      currentMax = Math.max(nums[i], currentMax + nums[i]);
      maxSoFar = Math.max(maxSoFar, currentMax);
    }
  
    return maxSoFar;
  }`,
    
    "10. Dynamic Programming – 0/1 Knapsack": `function knapsack(weights: number[], values: number[], capacity: number): number {
    const n = weights.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (weights[i - 1] <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }
  
    return dp[n][capacity];
  }`
  };
  