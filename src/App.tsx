import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing.tsx";
import Index from "./pages/Index.tsx";
import Trial from "./pages/Trial.tsx";
import Updates from "./pages/Updates.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminHome from "./pages/admin/AdminHome.tsx";
import PointsRecharge from "./pages/admin/PointsRecharge.tsx";
import Placeholder from "./pages/admin/Placeholder.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Index />} />
          <Route path="/trial" element={<Trial />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/about" element={<About />} />
          {/* Admin */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/points/query" element={<Placeholder title="贸力值查询" />} />
          <Route path="/admin/points/recharge" element={<PointsRecharge />} />
          <Route path="/admin/points/history" element={<Placeholder title="充值记录" />} />
          <Route path="/admin/users/trial" element={<Placeholder title="试用版会员" desc="支持新建试用版会员主账号、查看历史试用会员列表与详情。" />} />
          <Route path="/admin/users/paid" element={<Placeholder title="付费版会员" desc="支持新建付费版会员主账号、查看历史付费会员列表与详情。" />} />
          <Route path="/admin/users/lookup" element={<Placeholder title="手机账号查询" desc="支持输入手机号查询账号注册状态、所属团队及解绑操作。" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
