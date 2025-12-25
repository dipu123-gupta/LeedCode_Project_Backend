{
  "title": "Maximum Element in Array",
  "description": "Find the maximum element in the given integer array.",
  "difficulty": "easy",
  "tags": "array",

  "visibleTestCases": [
    {
      "input": "2 7 1 9",
      "output": "9",
      "explanation": "Maximum value is 9"
    },
    {
      "input": "5 3 8 6",
      "output": "8",
      "explanation": "Maximum value is 8"
    }
  ],

  "hiddenTestCases": [
    {
      "input": "-1 -5 -3",
      "output": "-1"
    },
    {
      "input": "100 50 200 150",
      "output": "200"
    }
  ],

  "startCode": [
    {
      "language": "javascript",
      "initialCode": "function findMax(arr) {\n  // write your code here\n}"
    },
    {
      "language": "java",
      "initialCode": "class Solution {\n  public int findMax(int[] arr) {\n    return 0;\n  }\n}"
    },
    {
      "language": "c++",
      "initialCode": "#include <iostream>\nusing namespace std;\nint main(){\n  return 0;\n}"
    },
    {
      "language": "c",
      "initialCode": "#include <stdio.h>\nint main(){\n  return 0;\n}"
    }
  ],

  "referenceSolution": [
    {
      "language": "javascript",
      "completCode": "const fs=require('fs');const a=fs.readFileSync(0,'utf8').trim().split(/\\s+/).map(Number);let m=a[0];for(let i=1;i<a.length;i++){if(a[i]>m)m=a[i];}console.log(m);"
    },
    {
      "language": "java",
      "completCode": "import java.util.*;class Main{public static void main(String[]args){Scanner sc=new Scanner(System.in);int m=Integer.MIN_VALUE;while(sc.hasNextInt()){m=Math.max(m,sc.nextInt());}System.out.print(m);}}"
    },
    {
      "language": "c++",
      "completCode": "#include <bits/stdc++.h>\nusing namespace std;int main(){int x,m=-1e9;while(cin>>x)m=max(m,x);cout<<m;}"
    },
    {
      "language": "c",
      "completCode": "#include <stdio.h>\nint main(){int x,m=-1000000000;while(scanf(\"%d\",&x)==1){if(x>m)m=x;}printf(\"%d\",m);return 0;}"
    }
  ],

  "problemCreater": "676bc4868f2946e4ead787c0"
}
